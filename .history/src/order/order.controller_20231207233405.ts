import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from 'dto/createOrderDto';
import { Request } from 'express';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() request: Request) {
        const userId = request.user['userId']
        return this.orderService.createOrder(createOrderDto, userId);
        
    }
}
