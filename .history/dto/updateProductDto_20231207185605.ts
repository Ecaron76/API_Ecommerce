import { IsNotEmpty } from "class-validator"


export class CreateProductDto{
    
    readonly name?: string
    
    readonly price?: number
}