import { Injectable, NotFoundException } from '@nestjs/common';
import { AddProductDto } from 'dto/addProductDto';
import { CreateOrderDto } from 'dto/createOrderDto';

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
          throw new NotFoundException("Le produit n'éxiste pas");
        }
    
        // Vérifier que l'utilisateur existe
        const user = await this.prismaService.user.findUnique({
          where: { userId },
        });
    
        if (!user) {
          throw new NotFoundException("Utilisateur non trouvé.");
        }
    
        // Ajouter le produit à la commande
        const updatedOrder = await this.prismaService.order.update({
          where: { userId },
          data: {
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
      }
    
   
}
