import { Module } from '@nestjs/common';
import { GetUserController } from './getUsers.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { RabbitMQService } from '../../shared/rabbitmq/rabbitMQ.service';
import { RabbitMQConfig } from '../../shared/rabbitmq/config/rabbit.config';
import { UserAlreadyExistsFilter } from '../../shared/exceptions/user.already.exist';
import { CreateUsersController } from './createUsers.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { UserApi } from '../../shared/database/api/user.api';
import { UserSchema } from './schemas/user.schema';
import { EmailService } from '../../shared/email/email.service';

@Module({
  controllers: [GetUserController, CreateUsersController],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IUserApi',
      useClass: UserApi,
    },
    {
      provide: 'IRabbitMQService',
      useClass: RabbitMQService,
    },
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    RabbitMQConfig,
    UserAlreadyExistsFilter,
  ],
  exports: ['IUserApi'],
})
export class UserModule {}
