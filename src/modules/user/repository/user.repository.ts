import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserApi } from 'src/modules/database/api/user-api.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('IUserApi') private readonly userApi: IUserApi,
  ) {}

  async createUser(user: UserDto): Promise<UserEntity> {
    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findById(userId: number): Promise<UserDto> {
    try {
      return await this.userApi.findById(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to find user by email');
    }
  }
}
