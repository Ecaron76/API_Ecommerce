import { IsNotEmpty } from "class-validator"


export class UpdateProductDto{
    @IsNotEmpty()
    readonly name?: string
    @IsNotEmpty()
    readonly price?: number
}