import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ImageService } from '../../../../utils/helpers/image.service';

@Injectable()
export class AvatarService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
  ) {}

  async getUserAvatar(userId: number): Promise<any> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not found');
    }
    try {
      const avatarBase64 = await this.imageService.downloadImage(user);
      const image = {
        imageId: user.id,
        imageData: avatarBase64,
      };

      const newImage = await this.userRepository.saveImage(image);

      const savedImage = await this.userRepository.findImageById(
        newImage.imageId,
      );

      return avatarBase64;
    } catch (e) {
      throw new Error('Error downloading image');
    }
  }
  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    const dbUser = await this.userRepository.findImageById(user.id);

    if (!dbUser) {
      throw new NotFoundException('Not Found');
    }

    await this.userRepository.removeEntryFromDB(user.id);
  }
}
