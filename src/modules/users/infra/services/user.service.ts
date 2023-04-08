import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { NotificationService } from '../../../../utils/helpers/notification.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async getUserById(userId: number): Promise<any> {
    const user = this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('Not found');
    }

    return user;
  }

  async createUser(user: any): Promise<any> {
    const createdUser = await this.userRepository.createUser(user);
    if (!createdUser) {
      throw new BadRequestException('Failed to create user');
    }
    const message = `Your account has been created successfully`;
    await this.notificationService.sendEmailNotification(
      createdUser.email,
      message,
    );
    return createdUser;
  }
}
