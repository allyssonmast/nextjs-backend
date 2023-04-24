import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserService {
  getUserById(userId: number): Promise<any>;
  createUser(user: UserDto): Promise<UserEntity>;
}
