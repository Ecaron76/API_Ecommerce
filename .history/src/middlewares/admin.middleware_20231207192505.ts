
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User; 
    if (user && user.role === 'admin') {
      next(); 
    } else {
      throw new ForbiddenException('Interdiction');
    }
  }
}