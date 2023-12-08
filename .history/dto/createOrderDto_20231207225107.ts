// create-order.dto.ts
import { IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, Min, IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Le champ "products" ne peut pas être vide.' })
  @IsArray({ message: 'Le champ "products" doit être un tableau.' })
  @ArrayMinSize(1, { message: 'Au moins un produit doit être ajouté à la commande.' })
  @ArrayMaxSize(10, { message: 'La commande ne peut pas contenir plus de 10 produits.' })
  products: ProductDto[];
}

export class ProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}