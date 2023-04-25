import { User } from '../../schemas/user.schema';

export const userStub = (): User => ({
  id: 1,
  email: 'john.doe@example.com',
  first_name: 'John',
  password: '123456',
  last_name: 'Doe',
  avatar: 'http://example.com/avatar.jpg',
});
