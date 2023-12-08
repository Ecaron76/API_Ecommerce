import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderLineDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;


}