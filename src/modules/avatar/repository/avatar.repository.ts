import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Avatar } from '../schemas/avatar.schema';
import { IUserApi } from 'src/shared/database/api/user-api.interface';
import { IAvatarRepository } from '../interfaces/avatar.repository.interface';

@Injectable()
export class AvatarRepository implements IAvatarRepository {
  constructor(
    @InjectModel(Avatar.name) private readonly imageModel: Model<Avatar>,
    @Inject('IUserApi') private readonly userApi: IUserApi,
  ) {}

  async getUserById(userId: number): Promise<any> {
    return await this.userApi.findById(userId);
  }

  async saveImage(image: Avatar): Promise<Avatar> {
    try {
      return await this.imageModel.create(image);
    } catch (err) {
      throw new Error(`Failed to save image: Failed to save image`);
    }
  }

  async findImageById(imageId: string): Promise<Avatar> {
    try {
      const image = await this.imageModel.findOne({ imageId: imageId }).exec();
      return image;
    } catch (err) {
      throw new Error(`Failed to find image by id: ${err.message}`);
    }
  }

  async removeEntryFromDB(imageId: string): Promise<void> {
    try {
      await this.imageModel.deleteOne({ imageId }).exec();
    } catch (err) {
      throw new Error(`Failed to remove avatar entry from DB: ${err.message}`);
    }
  }
}
