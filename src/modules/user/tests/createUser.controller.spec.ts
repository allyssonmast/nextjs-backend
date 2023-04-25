import { CreateUsersController } from '../createUsers.controller';
import { UserService } from '../user.service';
import { UserDto } from '../dto/user.dto';

const mockUserService = {
  getUserById: jest.fn() as any,
  createUser: jest.fn() as any,
};

describe('getUsersController', () => {
  let userController: CreateUsersController;

  beforeEach(() => {
    userController = new CreateUsersController(mockUserService as UserService);
  });

  describe('createUser', () => {
    it('should call userService.createUser with correct user object', async () => {
      const newUser: UserDto = {
        first_name: 'Test User',
        last_name: 'Last Name',
        email: 'test@example.com',
        password: '123456',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      };

      mockUserService.createUser.mockResolvedValueOnce(newUser);

      const result = await userController.createUser(newUser);

      expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });
});
