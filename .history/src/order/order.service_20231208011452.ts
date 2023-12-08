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
    async updateOrderLine(orderLineId: number, updateOrderLineDto: UpdateOrderLineDto) {
        const { quantity } = updateOrderLineDto;
    
        // Vérifie si l'orderLine existe
        const existingOrderLine = await this.prismaService.orderLine.findUnique({
          where: { orderLineId },
        });
    
        if (!existingOrderLine) {
          throw new NotFoundException("L'orderLine n'existe pas");
        }
    
        // Met à jour la quantité de l'orderLine
        const updatedOrderLine = await this.prismaService.orderLine.update({
          where: { orderLineId },
          data: {
            quantity,
          },
        });
    
        // Met à jour le totalAmount de la commande
        await this.updateOrderTotalAmount(existingOrderLine.orderId);
    
        return updatedOrderLine;
      }
      async updateOrderTotalAmount(orderId: number) {
        // Récupère la somme des montants des orderLines pour la commande spécifiée
        const orderTotalAmount = await this.prismaService.orderLine.aggregate({
          where: { orderId },
          _sum: { quantity: true },
        });
    
        // Met à jour le totalAmount de la commande
        const updatedOrder = await this.prismaService.order.update({
          where: { orderId },
          data: {
            totalAmount: orderTotalAmount._sum?.quantity || 0,
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
