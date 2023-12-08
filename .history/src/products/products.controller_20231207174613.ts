import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from 'dto/createProductDto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    createProduct(@Body() createProductDto: CreateProductDto){

    }
    
}
