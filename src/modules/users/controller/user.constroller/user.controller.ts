import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { User } from '../../dto/user.entity';
import { UserService } from '../../infra/services/user.service';
import { UserNotFoundExceptionFilter } from '../../../../utils/errors/notfound.exception';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseFilters(new UserNotFoundExceptionFilter())
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
