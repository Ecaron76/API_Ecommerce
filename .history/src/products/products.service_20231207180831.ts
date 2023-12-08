import { Injectable } from '@nestjs/common';
import { CreateProductDto } from 'dto/createProductDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService){}
    async createProduct(createProductDto: CreateProductDto, userId: number){
        const {name, price} = createProductDto
        await this.prismaService.product.create({data: {name, price, userId}})
        return {data: "Le produit a été ajouté"}
    }
    async getAllProduct(createProductDto: CreateProductDto, userId: number){
        await this.prismaService.product.findMany()
    }
}
