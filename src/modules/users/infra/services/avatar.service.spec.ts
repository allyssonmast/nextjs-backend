import { AvatarService } from './avatar.service';
import { UserRepository } from '../repositories/user.repository';
import { ImageService } from '../../../../utils/helpers/image.service';

// Mock User Repository class
jest.mock('../../infra/repositories/user.repository');
const mockUserRepository = {
  getUserById: jest.fn().mockResolvedValue(null),
  createUser: jest.fn().mockResolvedValue(null),
  saveAvatar: jest.fn().mockResolvedValue(null),
  getAvatar: jest.fn().mockResolvedValue(null),
  deleteAvatar: jest.fn().mockResolvedValue(null),
  findByImageId: jest.fn().mockResolvedValue(null),
  removeEntryFromDB: jest.fn().mockResolvedValue(null),
};

describe('AvatarService', () => {
  let avatarService: AvatarService;
  let userRepository: UserRepository;
  let imageService: ImageService;

  beforeEach(() => {
    // Create an instance of AvatarService and inject mock classes
    userRepository = mockUserRepository as any;
    imageService = {} as any;
    avatarService = new AvatarService(userRepository, imageService);
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('getUserAvatar', () => {
    it('should return user avatar correctly', async () => {
      const userId = 1;
      const user = {
        userId: 1,
        email: 'user@example.com',
        avatar: 'avatar.png',
      };
      const avatarBase64 = 'base64-encoded-image';

      // Mock getUserById method to return user
      mockUserRepository.getUserById.mockResolvedValue(user);

      // Mock downloadImage method to return avatar base64
      imageService.downloadImage = jest.fn().mockResolvedValue(avatarBase64);

      // Call getUserAvatar method
      const result = await avatarService.getUserAvatar(userId);

      // Assert the result
      expect(result).toEqual(avatarBase64);

      // Assert that getUserById and downloadImage methods were called with correct arguments
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(imageService.downloadImage).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      // Mock getUserById method to return null
      mockUserRepository.getUserById.mockResolvedValue(null);

      // Call getUserAvatar method and expect it to throw an error
      await expect(avatarService.getUserAvatar(userId)).rejects.toThrow(
        'Not found',
      );

      // Assert that getUserById method was called with correct argument
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if an error occurs while downloading avatar', async () => {
      const userId = 1;
      const user = {
        userId: 1,
        email: 'user@example.com',
        avatar: 'avatar.png',
      };

      // Mock getUserById method to return user
      mockUserRepository.getUserById.mockResolvedValue(user);

      // Mock downloadImage method to throw an error
      imageService.downloadImage = jest
        .fn()
        .mockRejectedValue(new Error('Error downloading image'));

      // Call getUserAvatar method and expect it to throw an error
      await expect(avatarService.getUserAvatar(userId)).rejects.toThrow(
        'Error downloading image',
      );

      // Assert that getUserById and downloadImage methods were called with correct arguments
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(imageService.downloadImage).toHaveBeenCalledWith(user);
    });
  });
  describe('deleteAvatar', () => {
    it('should delete user avatar correctly', async () => {
      const userId = 1;
      const user = {
        id: 1,
        email: 'user@example.com',
        avatar: 'avatar.png',
      };

      // Mock UserRepository methods
      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'findByImageId').mockResolvedValue(user);
      jest
        .spyOn(userRepository, 'removeEntryFromDB')
        .mockResolvedValue(undefined);

      await avatarService.deleteAvatar(userId);

      // Verify UserRepository method calls
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.findByImageId).toHaveBeenCalledWith(user.id);
      expect(userRepository.removeEntryFromDB).toHaveBeenCalledWith(user.id);
    });

    it('should throw an exception if user is not found', async () => {
      const userId = 1;

      // Mock UserRepository getUserById method to return null
      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null);

      await expect(avatarService.deleteAvatar(userId)).rejects.toThrow(
        'Not Found',
      );

      // Verify UserRepository method call
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
