import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from 'dto/createOrderDto';
import { request } from 'express';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    createOrder(@Body() createOrderDto: CreateOrderDto){
        const userId = request.user['userId']
        return this.orderService.addProductToOrder(userId, createOrderDto);
        
    }
}
