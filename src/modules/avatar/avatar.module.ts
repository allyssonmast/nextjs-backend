import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AvatarService } from './avatar.service';

import { ImageService } from '../../utils/helpers/image.service';
import { UserApi } from '../database/api/user.api';
import { AvatarSchema } from './schemas/avatar.schema';
import { AvatarRepository } from './repository/avatar.repository';

@Module({
  controllers: [AvatarController],
  imports: [
    MongooseModule.forFeature([{ name: 'Avatar', schema: AvatarSchema }]),
  ],
  providers: [
    {
      provide: 'IAvatarService',
      useClass: AvatarService,
    },
    {
      provide: 'IAvatarRepository',
      useClass: AvatarRepository,
    },
    {
      provide: 'IUserApi',
      useClass: UserApi,
    },
    ImageService,
  ],
})
export class AvatarModule {}
