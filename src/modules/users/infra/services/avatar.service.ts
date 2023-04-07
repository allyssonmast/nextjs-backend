import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ImageService } from '../../../../utils/helpers/image.service';

@Injectable()
export class AvatarService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageService: ImageService,
  ) {}

  async getUserAvatar(userId: number): Promise<string> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not found');
    }
    try {
      const avatarBase64 = await this.imageService.downloadImage(user);

      return avatarBase64;
    } catch (e) {
      throw Error('Error downloading image');
    }
  }
  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not Found');
    }

    const dbUser = await this.userRepository.findByImageId(user.id);

    if (!dbUser) {
      throw new NotFoundException('Not Found');
    }

    await this.userRepository.removeEntryFromDB(user.id);
  }
}
