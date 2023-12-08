import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { CreateProductDto } from "./createProductDto";

export class AddProductToOrderDto {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    productId: number; // identifiant du produit
  
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    quantity: number; // quantité de produits à ajouter à la commande
  }

  export class CreateOrderDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'Au moins un produit doit être ajouté à la commande.' })
    @ArrayMaxSize(10, { message: 'La commande ne peut pas contenir plus de 10 produits.' })
    products: AddProductToOrderDto[];
  }