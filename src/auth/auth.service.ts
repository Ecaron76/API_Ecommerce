import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from 'dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist';
import * as bcrypt from 'bcrypt'
import { EmailService } from 'src/email/email.service';
import * as speakeasy from 'speakeasy'
import { LoginDto } from 'dto/loginDto';
import { ResetPasswordDemandDto } from 'dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from 'dto/resetPasswordConfirmationDto';
import { DeleteAccountDto } from 'dto/deleteAccountDto';


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService, 
        private readonly emailService: EmailService, 
        private readonly jwtService : JwtService, 
        private readonly configService: ConfigService){}
    async signup(signupDto: SignupDto){
        const {email, username, password, role} = signupDto
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (user) throw new ConflictException("L'utilisateur éxiste déjà")
        const hash = await bcrypt.hash(password,10)
        await this.prismaService.user.create(
            {data: {email, username, password: hash, role}
        })
        // ** Envoyer un email de confirmation 
        // await this.emailService.sendSignupConfirmation(email)
        return {data: "Utilisateur enregistré avec succès"}
    }
    async login(loginDto: LoginDto){
        const {email, password} = loginDto
        const user = await this.prismaService.user.findUnique({where: {email}})
        if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas")
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Mot de passe incorrecte")
        const payload = {
            sub: user.userId,
            email: user.email
        } 
        const token = this.jwtService.sign(payload, {
            expiresIn:"24h", 
            secret: this.configService.get("SECRET_KEY")
        })

        return {
            token, 
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        }

    }
    async resetPasswordDemand(resetPasswordDemandDto: ResetPasswordDemandDto){
        const { email } = resetPasswordDemandDto
        const user = await this.prismaService.user.findUnique({where : {email}})
        if(!user) throw new NotFoundException("Utilisateur introuvable")
        const code = speakeasy.totp({
            secret: this.configService.get("OTP_CODE"),
            digits: 5,
            step: 60*15,
            encoding: "base32"
        })
        const url: string = "http://localhost:3000/auth/reset-password-confirmation"
        await this.emailService.sendResetPassword(email, url, code)

        return {data: "L'email de réinitialisation de mot de passe a été envoyé sur votre adresse"}

    }
    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto){
        const {code, email, password} = resetPasswordConfirmationDto
        const user = await this.prismaService.user.findUnique({where : {email}})
        if(!user) throw new NotFoundException("Utilisateur introuvable")
        const match = speakeasy.totp.verify({
            secret: this.configService.get('OTP_CODE'),
            token: code,
            digits: 5,
            step: 60*15,
            encoding: 'base32'
        })
        if(!match) throw new UnauthorizedException('Code invalide ou éxpiré')
        const hash = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({where: {email}, data: {password: hash}})
        return {data: "Mot de passe mis à jour"}
    }
    async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto){
        const {password} = deleteAccountDto
        const user = await this.prismaService.user.findUnique({where: {userId}})
        if (!user) throw new NotFoundException("L'utilisateur n'éxiste pas")
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new UnauthorizedException("Mot de passe incorrecte")
        await this.prismaService.user.delete({where: {userId}})
        return {data: "Le compte a bien été supprimé"}
    }
}
