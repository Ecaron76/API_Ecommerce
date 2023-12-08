import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AddProductDto } from 'dto/addProductDto';
import { UpdateOrderLineDto } from 'dto/updateOrderLineDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) {}
    async addProductToOrder(addProductDto: AddProductDto, userId: number) {
        const { productId, quantity } = addProductDto;
      
        // Vérifier que le produit existe
        const product = await this.prismaService.product.findUnique({
          where: { productId },
        });
      
        if (!product) {
          throw new NotFoundException("Le produit n'existe pas");
        }
      
        // Convertir le prix du produit en nombre
        const priceAsNumber: number = +product.price;
        
        // Calculer le montant total pour le nouveau produit
        const productTotalAmount: number = priceAsNumber * quantity;
      
        // Trouver la commande existante de l'utilisateur
        const existingOrder = await this.prismaService.order.findFirst({
            where: { userId },
            include: { orderLines: true },
        });
      
        // Si la commande existe, la mettre à jour
        if (existingOrder) {
            // Ajouter le totalAmount existant au nouveau totalAmount
            const updatedTotalAmount: Prisma.Decimal = Prisma.Decimal.add(
            existingOrder.totalAmount,
            productTotalAmount
          );
      
          const updatedOrder = await this.prismaService.order.update({
            where: { orderId: existingOrder.orderId },
            data: {
              totalAmount: updatedTotalAmount,
              orderLines: {
                create: {
                  productId,
                  quantity,
                },
              },
            },
            include: {
              orderLines: {
                include: {
                  product: true,
                },
              },
            },
          });
      
          return updatedOrder;
        } else {
          // Si la commande n'existe pas, la créer avec la nouvelle ligne de commande
          const newOrder = await this.prismaService.order.create({
            data: {
              userId,
              totalAmount: productTotalAmount, // Utiliser le totalAmount calculé pour le premier produit
              orderLines: {
                create: [
                  {
                    productId,
                    quantity,
                  },
                ],
              },
            },
            include: {
              orderLines: {
                include: {
                  product: true,
                },
              },
            },
          });
      
          return newOrder;
        }
    }
    async deleteOrderLine(orderLineId: number) {
        // Vérifie si l'orderLine existe
        const existingOrderLine = await this.prismaService.orderLine.findUnique({
          where: { orderLineId },
          include: {
            order: {
              include: {
                orderLines: true,
              },
            },
          },
        });
    
        if (!existingOrderLine) {
          throw new NotFoundException("L'orderLine n'existe pas");
        }
    
        // Supprime l'orderLine
        await this.prismaService.orderLine.delete({
          where: { orderLineId },
        });
    
        // Met à jour le totalAmount de la commande
        await this.updateOrderTotalAmount(existingOrderLine.orderId);
    
        return existingOrderLine;
      }
      async updateOrderTotalAmount(orderId: number) {
        // Récupère les informations nécessaires pour le calcul du totalAmount en utilisant une requête SQL brute
        const rawQuery = Prisma.sql`
        SELECT
            o.orderId,
            SUM(ol.quantity * p.price) AS newTotalAmount
        FROM "Order" o
        INNER JOIN "OrderLine" ol ON o.orderId = ol.orderId
        INNER JOIN "Product" p ON ol.productId = p.productId
        WHERE o.orderId = ${orderId}
        GROUP BY o.orderId
        `;

        const result = await this.prismaService.$queryRaw(rawQuery);
    
        // Met à jour le totalAmount de la commande
        const updatedOrder = await this.prismaService.order.update({
          where: { orderId },
          data: {
            totalAmount: result[0]?.newTotalAmount || 0,
          },
          include: {
            orderLines: {
              include: {
                product: true,
              },
            },
          },
        });
    
        return updatedOrder;
      }
      
}
