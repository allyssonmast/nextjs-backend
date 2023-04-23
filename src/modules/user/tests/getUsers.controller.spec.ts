import { GetUserController } from '../getUsers.controller';
import { UserService } from '../user.service';
import { UserDto } from '../dto/user.dto';

const mockUserService = {
  getUserById: jest.fn() as any,
  createUser: jest.fn() as any,
};

describe('UserController', () => {
  let userController: GetUserController;

  beforeEach(() => {
    userController = new GetUserController(mockUserService as UserService);
  });

  describe('getUserById', () => {
    it('should call userService.getUserById with correct userId', async () => {
      const userId = 1;
      const user: UserDto = {
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
