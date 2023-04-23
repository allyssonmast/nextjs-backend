import { UserService } from '../user.service';
import { UserRepository } from '../repository/user.repository';
import { NotificationService } from '../../../utils/helpers/notification.service';

jest.mock('../repository/user.repository');
const mockUserRepository = {
  getUserById: jest.fn().mockResolvedValue(null),
  createUser: jest.fn(),
  saveAvatar: jest.fn(),
  getAvatar: jest.fn(),
  deleteAvatar: jest.fn(),
};

jest.mock('../../../utils/helpers/notification.service');
const mockNotificationService = {
  sendEmailNotification: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let notificationService: NotificationService;

  beforeEach(() => {
    userRepository = mockUserRepository as any;
    notificationService = mockNotificationService as any;
    userService = new UserService(userRepository, notificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return an error when user is not found', async () => {
      userRepository.getUserById = jest.fn().mockResolvedValue(null);

      const userId = 99999;
      const result = await userService.getUserById(userId);
      expect(result).toBe(null); //find the error x)

      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    });

    it('deve retornar um usuário pelo ID', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      mockUserRepository.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('must create a new user and send a notification', async () => {
      const mockUser = {
        id: 1,
        first_name: 'Test User',
        email: 'test@example.com',
      };
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      const result = await userService.createUser(mockUser);

      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(
        mockNotificationService.sendEmailNotification,
      ).toHaveBeenCalledWith(mockUser.email, expect.any(String));
      expect(result).toEqual(mockUser);
    });

    it('should return an error when an error occurs in the repository', async () => {
      userRepository.createUser = jest
        .fn()
        .mockRejectedValue(new Error('Failed to create user'));

      const newUser = { nome: 'John', email: 'john@example.com' };
      await expect(userService.createUser(newUser)).rejects.toThrowError(
        'Failed to create user',
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(newUser);
    });
  });
});
