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
        const priceAsNumber: number = +product.price;
        let totalAmount: number = priceAsNumber * quantity;
    
        // Trouver la commande existante de l'utilisateur
        const existingOrder = await this.prismaService.order.findFirst({
          where: { userId },
          include: { orderLines: true },
        });
    
        // Si la commande existe, la mettre à jour
        if (existingOrder) {
          const updatedOrder = await this.prismaService.order.update({
            where: { orderId: existingOrder.orderId },
            data: {
              totalAmount, // Assure-toi que totalAmount est inclus ici
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
              totalAmount, // Assure-toi que totalAmount est inclus ici
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
