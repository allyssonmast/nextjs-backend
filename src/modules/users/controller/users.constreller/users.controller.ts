import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { User } from '../../dto/user.entity';
import { UserService } from '../../infra/services/user.service';
import { MissingParamsFilter } from '../../../../utils/errors/missing.params.error';
import { UserAlreadyExistsFilter } from '../../../../utils/errors/user.already.exist';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new MissingParamsFilter())
  @UseFilters(new UserAlreadyExistsFilter())
  async createUser(@Body() user: any): Promise<User> {
    return this.userService.createUser(user);
  }
}
