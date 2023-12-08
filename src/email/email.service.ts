import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class EmailService {
    private async transporter (){
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        })
        return transport
    }

    async sendSignupConfirmation(userEmail: string){
        (await this.transporter()).sendMail({
            from: "email@localhost.com",
            to: userEmail,
            subject: "Inscription confirmée",
            text: "Félicitation, votre compté a bien été créé."
        })
    }

    async sendResetPassword(userEmail: string, url: string, code: string){
        (await this.transporter()).sendMail({
            from: "email@localhost.com",
            to: userEmail,
            subject: "reinitialisation de mot de passe",
            html: `
                <a href="${url}">Reset password </a>
                <p>Secret code <strong>${code}</strong></p>
                <p>Le code expirera dans 15 minutes </p> 
            `
        })
    }
}
