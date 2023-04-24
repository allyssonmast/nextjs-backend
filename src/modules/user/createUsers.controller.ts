import { Controller, Post, Body, UseFilters, Inject } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { MissingParamsFilter } from '../../utils/errors/missing.params.error';
import { UserAlreadyExistsFilter } from '../../utils/errors/user.already.exist';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './interfaces/user.service.interface';

@Controller('api/users')
export class CreateUsersController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Post()
  @UseFilters(new MissingParamsFilter())
  @UseFilters(new UserAlreadyExistsFilter())
  async createUser(@Body() createUserDto: UserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }
}
