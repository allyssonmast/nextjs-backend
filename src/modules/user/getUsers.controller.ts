import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UserNotFoundExceptionFilter } from '../../utils/errors/notfound.exception';

@Controller('api/user')
export class GetUserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseFilters(new UserNotFoundExceptionFilter())
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    return this.userService.getUserById(userId);
  }
}
