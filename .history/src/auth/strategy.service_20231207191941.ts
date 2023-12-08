import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
    email: string,
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('SECRET_KEY'),
            ignoreExpiration: false
        })
    }
    async validate(payload: Payload) {
        const user = await this.prismaService.user.findFirst({where: {email: payload.email}})
        if(!user) throw new UnauthorizedException('Non autorisé')
        return {
            userId: user.userId, // Ajoutez d'autres propriétés si nécessaires
            username: user.username,
            email: user.email,
            role: user.role, // Ajoutez le rôle depuis le JWT payload
        };
    }
}

