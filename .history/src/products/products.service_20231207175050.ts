import { Injectable } from '@nestjs/common';
import { CreateProductDto } from 'dto/createProductDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService){}
    createProduct(createProductDto: CreateProductDto, userId: number){

    }
}
