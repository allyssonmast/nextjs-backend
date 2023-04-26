import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IUserRepository } from './interfaces/user.repository.interface';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserAlreadyExistsException } from '../../shared/exceptions/user.exception.error';
import { IRabbitMQService } from './interfaces/rabbitmq.service.interface';
import { IEmailService } from './interfaces/email.service.interface';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IEmailService') private readonly emailService: IEmailService,
    @Inject('IRabbitMQService')
    private readonly rabbitMQService: IRabbitMQService,
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
      const createdUser: UserEntity = await this.userRepository.createUser(
        user,
      );
      const message = `Your account has been created successfully`;

      this.rabbitMQService.sendEmailNotification(createdUser.email, message);

      const emailDto: EmailDto = {
        to: createdUser.email,
        subject: 'Confirmation email',
        text: message,
      };

      this.emailService.sendEmail(emailDto);

      return createdUser;
    } catch (e) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
