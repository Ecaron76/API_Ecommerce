import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from 'dto/createOrderDto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) {}
    async createOrder(createOrderDto: CreateOrderDto, userId: number) {
        const { totalAmount, orderLines } = createOrderDto;
    
        // Créer une nouvelle commande
        const newOrder = await this.prismaService.order.create({
          data: {
            userId,
            totalAmount,
            orderLines: {
              create: orderLines.map((line) => ({
                productId: line.productId,
                quantity: line.quantity,
              })),
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
