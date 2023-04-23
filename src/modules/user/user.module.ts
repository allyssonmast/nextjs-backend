import { Module } from '@nestjs/common';
import { GetUserController } from './getUsers.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { NotificationService } from 'src/utils/helpers/notification.service';
import { RabbitMQConfig } from 'src/utils/helpers/rabbit.config';
import { UserAlreadyExistsFilter } from 'src/utils/errors/user.already.exist';
import { EmailValidator } from 'src/utils/helpers/email.validator';
import { CreateUsersController } from './createUsers.controller';

@Module({
  controllers: [GetUserController, CreateUsersController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    NotificationService,
    RabbitMQConfig,
    EmailValidator,
    UserAlreadyExistsFilter,
  ],
  exports: ['IUserApi'],
})
export class UserModule {}
