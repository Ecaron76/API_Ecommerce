import { Body, Controller, Post, UseGuards, Delete, Req  } from '@nestjs/common';
import { SignupDto } from 'dto/signupDto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from 'dto/loginDto';
import { ResetPasswordDemandDto } from 'dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from 'dto/resetPasswordConfirmationDto';
import { Request } from 'express';
import { DeleteAccountDto } from 'dto/deleteAccountDto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
        
    }
    
    @Post("signup") 
    signup(@Body()signupDto: SignupDto){
        return this.authService.signup(signupDto)
    }
    @Post("login")
    login(@Body()loginDto: LoginDto){
        return this.authService.login(loginDto)
    }
    @Post("reset-password")
    resetPasswordDemand(@Body()resetPasswordDemandDto: ResetPasswordDemandDto){
        return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }
    @Post("reset-password-confirmation")
    resetPasswordConfirmation(@Body()resetPasswordConfirmationDto: ResetPasswordConfirmationDto){
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteAccount(@Req() req: Request, @Body() deleteAccountDto: DeleteAccountDto){
        const userId: number = req.user['userId']
        return this.authService.deleteAccount(userId, deleteAccountDto)
        
    }

}
