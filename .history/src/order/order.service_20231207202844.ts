import { Injectable, NotFoundException } from '@nestjs/common';
import { AddProductToOrderDto, CreateOrderDto } from 'dto/addProductToOrderDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prismaService: PrismaService) {}
    
   
}
