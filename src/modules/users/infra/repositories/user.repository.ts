import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { Image } from '../schemas/avatar.schema';
import { EmailValidator } from '../../../../utils/helpers/email.validator';
import { IUserApi } from '../../../../utils/interfaces/user-api.interface';
import { IUserRepository } from 'src/utils/interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    @Inject('IUserApi') private readonly userApi: IUserApi,
    private readonly emailValidation: EmailValidator,
  ) {}

  async createUser(user: any) {
    if (!user.email || !user.first_name || !user.last_name || !user.avatar) {
      throw new BadRequestException();
    }

    const isEmailValid = await this.emailValidation.validateEmail(user.email);
    if (!isEmailValid) {
      throw new BadRequestException();
    }

    const dbUser = await this.findByEmail(user.email);
    if (dbUser) {
      throw new NotFoundException('Not found');
    }

    try {
      const createdUser = new this.userModel(user);
      const newUser = createdUser.save();
      return newUser;
    } catch (e) {
      throw new Error('Create user failed');
    }
  }

  async getUserById(userId: number): Promise<any> {
    return await this.userApi.findById(userId);
  }
  async findByEmail(email: string): Promise<any> {
    const user = this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    return user.exec();
  }

  async saveImage(image: any): Promise<Image> {
    try {
      const savedImage = new this.imageModel(image);
      return await savedImage.save();
    } catch (err) {
      throw new Error(`Failed to save image: ${err.message}`);
    }
  }

  async findImageById(imageId: string): Promise<Image> {
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
