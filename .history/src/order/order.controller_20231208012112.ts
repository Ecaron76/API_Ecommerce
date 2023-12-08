import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AddProductDto } from 'dto/addProductDto';
import { UpdateOrderLineDto } from 'dto/updateOrderLineDto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('add-product')
    async addProductToOrder(@Body() addProductDto: AddProductDto, @Req() request: Request) {
    const userId = request.user['userId'];
    const updatedOrder = await this.orderService.addProductToOrder(addProductDto, userId);
    }
    
    
  
}
