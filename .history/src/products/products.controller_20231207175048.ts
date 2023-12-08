import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from 'dto/createProductDto';
import {Request} from 'express'
@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    createProduct(@Body() createProductDto: CreateProductDto, @Req() request: Request){
        const userId = request.user["userId"]
        return this.productService.createProduct(createProductDto, userId)
    }
    
}
