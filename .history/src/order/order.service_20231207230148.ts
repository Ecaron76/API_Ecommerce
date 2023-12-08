import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from 'dto/createOrderDto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) {}
    
    async addProductToOrder(userId: number, createOrderDto: CreateOrderDto): Promise<any> {
        // Vérifier si la commande existe pour l'utilisateur
        let order = await this.prismaService.order.findFirst({
          where: {
            userId,
          },
          include: {
            orderLines: true,
          },
        });

        if (!order) {
            order = await this.prismaService.order.create({
              data: {
                userId,
                totalAmount: createOrderDto.totalAmount, 
                orderLines: {
                  create: createOrderDto.products.map((productDto) => ({
                    product: {
                      connect: {
                        productId: productDto.productId,
                      },
                    },
                    quantity: productDto.quantity,
                  })),
                },
              },
              include: {
                orderLines: true,
              },
            });
          }
    }
   
}
