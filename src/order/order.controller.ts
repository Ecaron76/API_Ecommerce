import { Body, Controller, Param, Patch, Post, Req, UseGuards, Delete, ParseIntPipe, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateOrderDto } from 'dto/createOrderDto';
import { CreateOrderLineDto } from 'dto/createOrderLineDto';


@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
        async createOrder( @Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.createOrder(userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete(':orderId')
    async deleteOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.deleteUserOrder(userId, orderId);
    }
    
    @Get('all')
    async getAllOrders() {
        return this.orderService.getAllOrders();
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getUserAllOrders(@Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.getUserAllOrders(userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get(':orderId')
        async getUserOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.getUserOrder(userId, orderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('order-line/create')
    async createOrderLine(@Body()createOrderDto: CreateOrderLineDto, @Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.createOrderLine(userId,createOrderDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Patch('order-line/update')
    async updateOrderLine(@Body() createOrderLineDto: CreateOrderLineDto, @Req() request: Request) {
        const userId: number = request.user['userId'];
        return this.orderService.updateOrderLine(userId, createOrderLineDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('order-line/delete/:orderLineId')
        async deleteOrderLine(@Param('orderLineId', ParseIntPipe) orderLineId: number,@Req() request: Request,) {
        const userId: number = request.user['userId'];
        return this.orderService.deleteOrderLine(userId, orderLineId);
    }
}
