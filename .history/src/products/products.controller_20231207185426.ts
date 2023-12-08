import { Controller, Post, UseGuards, Body, Req, Get, Param, ParseIntPipe, Delete, Put  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from 'dto/createProductDto';
import {Request} from 'express'


@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    createProduct(@Body() createProductDto: CreateProductDto, @Req() request: Request){
        const userId = request.user['userId']
        return this.productService.createProduct(createProductDto, userId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    deleteProduct(@Param("id", ParseIntPipe) productId: number, @Req() request: Request){
        const userId = request.user['userId']
        return this.productService.deleteProduct(productId, userId)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    updateProduct(@Param("id", ParseIntPipe) productId: number, @Req() request: Request){
        const userId = request.user['userId']
        return this.productService.updateProduct(productId, userId)
    }


    @Get()
    getAllProducts(){
        return this.productService.getAllProducts()
    }
    
    @Get(':id')
    getOneProduct(@Param("id", ParseIntPipe) productId: number) {
        return this.productService.getOneProduct(productId);
    }
    
}
