import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { AdminMiddleware } from './middlewares/admin.middleware';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}), EmailModule, ProductsModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'products/create', method: RequestMethod.POST }, 
        { path: 'products/delete', method: RequestMethod.DELETE }, 
        { path: 'products/update', method: RequestMethod.PUT },   
      );
  }
}
