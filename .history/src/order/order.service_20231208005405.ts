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
        const productTotalAmount: Prisma.Decimal = (
          parseFloat(product.price) * quantity
        ).toString();
    
        // Trouver la commande existante de l'utilisateur
        const existingOrder = await this.prismaService.order.findFirst({
          where: { userId },
          include: { orderLines: true },
        });
    
        // Si la commande existe, vérifier si le produit est déjà dans la commande
        if (existingOrder) {
          const existingOrderLine = existingOrder.orderLines.find(
            (line) => line.productId === productId
          );
    
          if (existingOrderLine) {
            // Si le produit existe déjà dans la commande, incrémenter la quantité
            const updatedOrderLine = await this.prismaService.orderLine.update({
              where: { orderLineId: existingOrderLine.orderLineId },
              data: {
                quantity: existingOrderLine.quantity + quantity,
              },
            });
    
            // Mettre à jour le totalAmount de la commande
            const updatedTotalAmount: Prisma.Decimal = (
              parseFloat(existingOrder.totalAmount) +
              parseFloat(productTotalAmount)
            ).toString();
    
            const updatedOrder = await this.prismaService.order.update({
              where: { orderId: existingOrder.orderId },
              data: {
                totalAmount: updatedTotalAmount,
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
    
        // Si la commande n'existe pas ou si le produit n'est pas dans la commande, ajouter une nouvelle ligne de commande
        const newOrderLine = await this.prismaService.orderLine.create({
          data: {
            productId,
            quantity,
          },
        });
    
        // Mettre à jour le totalAmount de la commande
        const updatedTotalAmount: Prisma.Decimal = Prisma.Decimal.add(
            existingOrder.totalAmount,
            productTotalAmount
          );
    
        const updatedOrder = await this.prismaService.order.update({
          where: { orderId: existingOrder.orderId },
          data: {
            totalAmount: updatedTotalAmount,
            orderLines: {
              connect: { orderLineId: newOrderLine.orderLineId },
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
      }
    }
    
   
}
