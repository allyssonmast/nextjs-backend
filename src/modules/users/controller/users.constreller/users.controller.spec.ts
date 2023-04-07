import { UsersController } from './users.controller';
import { UserService } from '../../infra/services/user.service';
import { User } from '../../dto/user.entity';

jest.mock('../../infra/services/user.service');
jest.mock('../../infra/services/avatar.service');

const mockUserService = {
  getUserById: jest.fn() as any,
  createUser: jest.fn() as any,
};

describe('UserController', () => {
  let userController: UsersController;

  beforeEach(() => {
    userController = new UsersController(mockUserService as UserService);
  });

  describe('createUser', () => {
    it('should call userService.createUser with correct user object', async () => {
      const newUser: User = {
        id: 1,
        first_name: 'Test User',
        last_name: 'Last Name',
        email: 'test@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };

      mockUserService.createUser.mockResolvedValueOnce(newUser);

      const result = await userController.createUser(newUser);

      expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });
});
