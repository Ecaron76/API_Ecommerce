// create-order.dto.ts
import { IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, Min, IsInt, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  products: ProductDto[];
  @IsNumber()
  @Min(0)
  totalAmount: number;
}

export class ProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}