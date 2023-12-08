import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AddProductDto } from 'dto/addProductDto';
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
            const existingOrderLine = existingOrder.orderLines.find((line) => line.productId === productId);  
            
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
}
