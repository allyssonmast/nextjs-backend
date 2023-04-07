import { Module } from '@nestjs/common';
import {
  UserController,
  UsersController,
  AvatarController,
} from '../controller';
import { UserService } from '../infra/services/user.service';
import { AvatarService } from '../infra/services/avatar.service';
import { UserApi } from '../infra/database/rest.api/user.api';
import { UserRepository } from '../infra/repositories/user.repository';
import { NotificationService } from '../../../utils/helpers/notification.service';
import { UserSchema } from '../infra/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQConfig } from '../../../utils/helpers/rabbit.config';
import { ImageService } from '../../../utils/helpers/image.service';
import { ImageSchema } from '../infra/schemas/avatar.schema';
import { UserAlreadyExistsFilter } from '../../../utils/errors/user.already.exist';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Image', schema: ImageSchema },
    ]),
  ],
  controllers: [UserController, UsersController, AvatarController],
  providers: [
    UserService,
    AvatarService,
    UserRepository,
    UserApi,
    NotificationService,
    RabbitMQConfig,
    ImageService,
    UserAlreadyExistsFilter,
  ],
})
export class UserModule {}
