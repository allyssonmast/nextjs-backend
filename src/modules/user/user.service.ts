import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IUserRepository } from './interfaces/user.repository.interface';
import { NotificationService } from '../../utils/helpers/notification.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserAlreadyExistsException } from '../../utils/errors/user.exception.error';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async getUserById(userId: number): Promise<UserEntity> {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(user: UserDto): Promise<UserEntity> {
    const dbUser = await this.userRepository.findByEmail(user.email);

    if (dbUser) {
      throw new UserAlreadyExistsException();
    }

    try {
      const createdUser = await this.userRepository.createUser(user);
      const message = `Your account has been created successfully`;

      await this.notificationService.sendEmailNotification(
        createdUser.email,
        message,
      );
      return createdUser;
    } catch (e) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
