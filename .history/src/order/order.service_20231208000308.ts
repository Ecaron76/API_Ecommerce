import { Injectable, NotFoundException } from '@nestjs/common';
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
        const existingOrder = await this.prismaService.order.findFirst({
            where: { userId },
            include: { orderLines: true },
          });
          
          if (existingOrder) {
            const updatedOrder = await this.prismaService.order.update({
              where: { orderId: existingOrder.orderId },
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
    
   
}
