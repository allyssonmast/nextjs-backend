import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';

import { AvatarService } from './avatar.service';

import { ImageService } from 'src/utils/helpers/image.service';
import { UserRepository } from '../users/infra/repositories/user.repository';

@Module({
  controllers: [AvatarController],
  providers: [
    {
      provide: 'IAvatarService',
      useClass: AvatarService,
    },
    {
      provide: 'IAvatarRepository',
      useClass: UserRepository,
    },
    ImageService,
  ],
})
export class AvatarModule {}
