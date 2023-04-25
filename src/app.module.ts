import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './shared/database/mongoDB/database.module';
import { ConfigModule } from '@nestjs/config';
import { AvatarModule } from './modules/avatar/avatar.module';
import { APP_PIPE } from '@nestjs/core';
import { RabbitmqModule } from './shared/rabbitmq/rabbitmq.module';
import { EmailModule } from './shared/email/email.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AvatarModule,
    DatabaseModule,
    RabbitmqModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
