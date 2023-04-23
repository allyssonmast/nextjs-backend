import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { MissingParamsFilter } from '../../utils/errors/missing.params.error';
import { UserAlreadyExistsFilter } from '../../utils/errors/user.already.exist';

@Controller('api/users')
export class CreateUsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new MissingParamsFilter())
  @UseFilters(new UserAlreadyExistsFilter())
  async createUser(@Body() user: any): Promise<UserDto> {
    return this.userService.createUser(user);
  }
}
