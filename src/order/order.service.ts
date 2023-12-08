import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderLineDto } from 'dto/createOrderLineDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) {}
    async createOrder(userId: number){
      const user = await this.prismaService.user.findUnique({where: { userId }});
      if(!user) throw new NotFoundException("L'utilisateur n'éxiste pas")
      const order = await this.prismaService.order.create({
        data: {
          userId,
        },
      });
      return order;
    }
    async deleteUserOrder(userId: number, orderId: number) {
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");
  
      const existingOrder = await this.prismaService.order.findUnique({
        where: { orderId, userId },
      });
      console.log("Order after deletion:", existingOrder);

      if (!existingOrder) {
        throw new NotFoundException("La commande n'existe pas ou n'appartient pas à l'utilisateur");
      }
      console.log("Order after deletion:", existingOrder);

      if (existingOrder.userId !== userId) {
        throw new ForbiddenException("Vous n'avez pas la permission de supprimer cette commande");
      }

      await this.prismaService.orderLine.deleteMany({
        where: { orderId },
      });
  
      await this.prismaService.order.delete({
        where: { orderId },
      });

    }
    async getAllOrders() {
      const orders = await this.prismaService.order.findMany({
        include: { orderLines: { include: { product: true } } },
      });
      return orders
    }
    async getUserOrder(userId: number, orderId: number) {
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");
  
      const userOrder = await this.prismaService.order.findUnique({
        where: { orderId, userId },
        include: { orderLines: { include: { product: true } } },
      });
  
      if (!userOrder) {
        throw new NotFoundException("La commande n'existe pas ou n'appartient pas à l'utilisateur");
      }
  
      const totalAmount = userOrder.orderLines.reduce((acc, orderLine) => {
        return acc + Number(orderLine.product.price) * orderLine.quantity;
      }, 0);
  
      return { ...userOrder, totalAmount };
    }
    async getUserAllOrders(userId: number) {
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");
  
      const userOrders = await this.prismaService.order.findMany({
        where: { userId },
        include: { orderLines: { include: { product: true } } },
      });
  
      const ordersWithTotalPrice = userOrders.map((order) => {
        const totalAmount = order.orderLines.reduce((acc, orderLine) => {
          return acc + Number(orderLine.product.price) * orderLine.quantity;
        }, 0);
  
        return { ...order, totalAmount };
      });
  
      return ordersWithTotalPrice;
    }
    async createOrderLine(userId: number, createOrderLineDto: CreateOrderLineDto) {
      const { orderId, productId, quantity } = createOrderLineDto;
  
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");
  
      
      const orderExists = await this.prismaService.order.findUnique({ where: { orderId } });
      const productExists = await this.prismaService.product.findUnique({ where: { productId } });
  
      if (!orderExists || !productExists) {
        throw new NotFoundException("La commande ou le produit n'existe pas");
      }
      const amount = Number(productExists.price) * quantity;
      const orderLine = await this.prismaService.orderLine.create({
        data: {
          orderId,
          productId,
          quantity,
          amount: amount,
        },
      });
  
      return orderLine;
    }
    async updateOrderLine(userId: number, createOrderLineDto: CreateOrderLineDto) {
      const { orderId, productId, quantity } = createOrderLineDto;
  
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");
  
      const orderExists = await this.prismaService.order.findUnique({ where: { orderId } });
      const product = await this.prismaService.product.findUnique({ where: { productId } });
  
      if (!orderExists || !product) {
        throw new NotFoundException("La commande ou le produit n'existe pas");
      }
  
      const existingOrderLine = await this.prismaService.orderLine.findFirst({
        where: {
          orderId: orderExists.orderId,
          productId: product.productId,
        },
      });
  
      if (!existingOrderLine) {
        throw new NotFoundException("La ligne de commande n'existe pas");
      }
      const amount = Number(product.price) * quantity;

      const updatedOrderLine = await this.prismaService.orderLine.update({
        where: { orderLineId: existingOrderLine.orderLineId },
        data: {
          quantity,
          amount,
        },
      });
  
      return updatedOrderLine;
    }

    async deleteOrderLine(userId: number, orderLineId: number) {
      const user = await this.prismaService.user.findUnique({ where: { userId } });
      if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas");

      const existingOrderLine = await this.prismaService.orderLine.findUnique({
        where: { orderLineId },
        include: { order: true }, 
      });

      if (!existingOrderLine) {
        throw new NotFoundException("La ligne de commande n'existe pas");
      }

      if (existingOrderLine.order.userId !== userId) {
        throw new NotFoundException("Cette ligne de commande n'appartient pas à l'utilisateur actuel");
      }

      await this.prismaService.orderLine.delete({
        where: { orderLineId },
      });
      

      return { message: 'La ligne de commande a été supprimée avec succès' };
    }


    
      
}
