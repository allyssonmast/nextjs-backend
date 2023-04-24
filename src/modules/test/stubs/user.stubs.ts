import { UserDto } from '../../user/dto/user.dto';

export const userStub = (): UserDto => {
  return {
    email: 'test@example.com',
    first_name: 'Allysson',
    last_name: 'Freitas',
    avatar: 'avatar',
  };
};
