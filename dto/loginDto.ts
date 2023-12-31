import { IsNotEmpty, IsEmail } from "class-validator"

export class LoginDto{
    @IsEmail()
    readonly email: string
    @IsNotEmpty()
    readonly password: string
}