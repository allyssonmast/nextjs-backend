import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { EmailValidator } from '../../../utils/helpers/email.validator';
import { IUserApi } from 'src/utils/interfaces/user-api.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('IUserApi') private readonly userApi: IUserApi,
    private readonly emailValidation: EmailValidator,
  ) {}

  async createUser(user: any): Promise<User> {
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
      return await createdUser.save();
    } catch (e) {
      throw new Error('Create user failed');
    }
  }

  async getUserById(userId: number): Promise<any> {
    return await this.userApi.findById(userId);
  }
  async findByEmail(email: string): Promise<any> {
    try {
      const user = this.userModel.findOne({ email });
      return await user.exec();
    } catch (e) {
      throw new Error('Not found');
    }
  }
}
