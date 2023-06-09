import { UserDto } from '../../src/modules/user/dto/user.dto';

export const userStub = (): UserDto => {
  return {
    email: 'test@example.com',
    first_name: 'Allysson',
    last_name: 'Freitas',
    password: '1234526',
    avatar: 'avatar',
  };
};
