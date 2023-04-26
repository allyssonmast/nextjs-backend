import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './interfaces/user.service.interface';

@Controller('api/users')
export class CreateUsersController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService
  ) {}

  @Post()
  async createUser(@Body() createUserDto: UserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }
}
