import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ImageService } from '../../shared/image-encoder/image.service';
import { IAvatarService } from './interfaces/avatar.service.interface';
import { IAvatarRepository } from './interfaces/avatar.repository.interface';
import { UserAlreadyExistsException } from '../../shared/exceptions/user.exception.error';

@Injectable()
export class AvatarService implements IAvatarService {
  constructor(
    @Inject('IAvatarRepository')
    private readonly avatarRepository: IAvatarRepository,
    private readonly imageService: ImageService
  ) {}

  async getUserAvatar(userId: number): Promise<any> {
    const user = await this.avatarRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not found');
    }

    const dbUser = await this.avatarRepository.findImageById(user.id);

    if (dbUser) {
      throw new UserAlreadyExistsException();
    }

    try {
      const avatarBase64 = await this.imageService.downloadImage(user);
      const image = {
        imageId: user.id,
        imageData: avatarBase64,
      };

      const newImage = await this.avatarRepository.saveImage(image);

      const savedImage = await this.avatarRepository.findImageById(
        newImage.imageId
      );

      return savedImage.imageData.toString('base64');
    } catch (e) {
      throw new Error('Error downloading image');
    }
  }
  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.avatarRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    const dbUser = await this.avatarRepository.findImageById(user.id);

    if (!dbUser) {
      throw new NotFoundException('Not Found');
    }

    await this.avatarRepository.removeEntryFromDB(dbUser.imageId);
  }
}
