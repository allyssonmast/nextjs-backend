import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserApi } from '../database/rest.api/user.api';
import { User, UserDocument } from '../schemas/user.schema';
import { Image } from '../schemas/avatar.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private readonly userApi: UserApi,
  ) {}

  async createUser(user: any) {
    if (!user.email || !user.first_name || !user.last_name || !user.avatar) {
      throw new BadRequestException();
    }

    const dbUser = await this.findByEmail(user.email);
    if (dbUser) {
      throw new NotFoundException('Not found');
    }

    try {
      const createdUser = new this.userModel(user);
      return createdUser.save();
    } catch (e) {
      throw new Error('Not found');
    }
  }

  async getUserById(userId: number): Promise<any> {
    return await this.userApi.findById(userId);
  }
  async findByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByImageId(imageId: string): Promise<any> {
    return this.imageModel.findOne({ imageId }).exec();
  }

  async removeEntryFromDB(imageId: string): Promise<void> {
    try {
      await this.imageModel.deleteOne({ imageId }).exec();
    } catch (err) {
      throw new Error(`Failed to remove avatar entry from DB: ${err.message}`);
    }
  }
}
