import { Module } from '@nestjs/common';
import { GetUserController } from './getUsers.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { NotificationService } from '../rabbitmq/rabbit/notification.service';
import { RabbitMQConfig } from '../rabbitmq/rabbit/rabbit.config';
import { UserAlreadyExistsFilter } from '../../utils/errors/user.already.exist';
import { EmailValidator } from '../../utils/helpers/email.validator';
import { CreateUsersController } from './createUsers.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { UserApi } from '../database/api/user.api';
import { UserSchema } from './schemas/user.schema';

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
    NotificationService,
    RabbitMQConfig,
    EmailValidator,
    UserAlreadyExistsFilter,
  ],
  exports: ['IUserApi'],
})
export class UserModule {}
