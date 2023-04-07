import { UserController } from './user.controller';
import { UserService } from '../../infra/services/user.service';
import { User } from '../../dto/user.entity';

jest.mock('../../infra/services/user.service');
jest.mock('../../infra/services/avatar.service');

const mockUserService = {
  getUserById: jest.fn() as any,
  createUser: jest.fn() as any,
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController(mockUserService as UserService);
  });

  describe('getUserById', () => {
    it('should call userService.getUserById with correct userId', async () => {
      const userId = 1;
      const user: User = {
        id: 1,
        first_name: 'Test User',
        last_name: 'Last Name',
        email: 'test@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };

      mockUserService.getUserById.mockResolvedValueOnce(user);

      const result = await userController.getUserById(userId);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });
});
