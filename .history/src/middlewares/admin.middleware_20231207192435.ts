// admin.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; // Assurez-vous que cela correspond à votre objet User
 
    // Vérifiez si l'utilisateur a le rôle d'administrateur
    if (user && user.role === 'admin') {
      next(); // L'utilisateur a le droit d'accéder à la route suivante
    } else {
      throw new ForbiddenException('Permission denied. Only admins are allowed.');
    }
  }
}