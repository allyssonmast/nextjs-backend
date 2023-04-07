import { User } from '../../dto/user.entity';

export const userStub = (): User => {
  return {
    id: 123,
    email: 'test@example.com',
    first_name: 'Allysson',
    last_name: 'Freitas',
    avatar: 'avatar',
  };
};
