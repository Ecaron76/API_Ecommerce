import { IsNumber, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

}