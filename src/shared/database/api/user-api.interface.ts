import { UserDto } from 'src/modules/user/dto/user.dto';

export interface IUserApi {
  findById(userId: number): Promise<UserDto>;
}
