import { Injectable, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    async deleteProduct(productId: number, userId: number){
        const product = await this.prismaService.product.findUnique({where: {productId}})
        if(!product) throw new NotFoundException
        return await this.prismaService.product.delete({where:{ productId}})
    }
    async getAllProducts(){
        return await this.prismaService.product.findMany()
    }
    async getOneProduct(productId: number){
        return await this.prismaService.product.findFirst({where:{ productId}})
    }

    
}
