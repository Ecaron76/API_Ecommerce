

import { IsInt, IsDecimal, Min, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsDecimal({ decimal_digits: '2' })
  totalAmount: number;

  @IsArray()
  orderLines: {
    productId: number;
    quantity: number;
  }[];
}