import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}), EmailModule, ProductsModule],
})
export class AppModule {}
