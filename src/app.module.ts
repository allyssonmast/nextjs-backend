import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/module/user.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
  ],
})
export class AppModule {}
