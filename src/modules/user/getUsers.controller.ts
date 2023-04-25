import { Controller, Get, Param, UseFilters, Inject } from '@nestjs/common';
import { UserNotFoundExceptionFilter } from '../../shared/exceptions/notfound.exception';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './interfaces/user.service.interface';

@Controller('api/user')
export class GetUserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Get(':userId')
  @UseFilters(new UserNotFoundExceptionFilter())
  async getUserById(@Param('userId') userId: number): Promise<UserEntity> {
    return this.userService.getUserById(userId);
  }
}
