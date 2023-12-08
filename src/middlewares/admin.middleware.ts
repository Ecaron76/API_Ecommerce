
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { User } from '@prisma/client';
@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const user = req.user as User; // Utilisez req['user'] pour accéder aux informations de l'utilisateur
    console.log(user)
    if (user && user.role === 'admin') {
      next();
    } else {
      throw new ForbiddenException('Interdiction');
    }
  }
}