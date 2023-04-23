import { Controller, Get, Param, UseFilters, Inject } from '@nestjs/common';
import { UserNotFoundExceptionFilter } from '../../../../utils/errors/notfound.exception';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { IUserService } from 'src/modules/user/interfaces/user.service.interface';

@Controller('api/user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Get(':userId')
  @UseFilters(new UserNotFoundExceptionFilter())
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    return this.userService.getUserById(userId);
  }
}
