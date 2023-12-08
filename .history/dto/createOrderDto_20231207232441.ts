

import { IsInt, IsDecimal, Min, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsDecimal({ decimal_digits: '2' })
  totalAmount: number;

  @IsArray()
  orderLines: {
    productId: number;
    quantity: number;
  }[];
}