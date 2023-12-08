import { IsInt, Min } from 'class-validator';

export class AddProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
  totalAmount: number;
}