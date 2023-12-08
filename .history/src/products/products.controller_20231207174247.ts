import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    createProduct(){

    }
    
}
