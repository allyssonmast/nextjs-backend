import { AvatarService } from '../avatar.service';
import { AvatarRepository } from '../repository/avatar.repository';

import { Avatar } from '../schemas/avatar.schema';
import { NotFoundException } from '@nestjs/common';
import { ImageService } from '../../../utils/helpers/image.service';

const mockUserRepository = {
  getUserById: jest.fn().mockResolvedValue(null),
  createUser: jest.fn().mockResolvedValue(null),
  saveAvatar: jest.fn().mockResolvedValue(null),
  getAvatar: jest.fn().mockResolvedValue(null),
  saveImage: jest.fn().mockResolvedValue(null),
  deleteAvatar: jest.fn().mockResolvedValue(null),
  findImageById: jest.fn().mockResolvedValue(null),
  removeEntryFromDB: jest.fn().mockResolvedValue(null),
};

describe('AvatarService', () => {
  let avatarService: AvatarService;
  let avatarRepository: AvatarRepository;
  let imageService: ImageService;

  beforeEach(() => {
    // Create an instance of AvatarService and inject mock classes
    avatarRepository = mockUserRepository as any;
    imageService = new ImageService();
    avatarService = new AvatarService(avatarRepository, imageService);
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('getUserAvatar', () => {
    it('should return the user avatar as a string when given a valid user ID', async () => {
      // Arrange
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const avatarBase64 = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAgAElEQVR4Xu3dQY7aMAxFUa9f3',
        'binary',
      );

      jest.spyOn(avatarRepository, 'getUserById').mockResolvedValue(user);
      jest
        .spyOn(imageService, 'downloadImage')
        .mockResolvedValue(avatarBase64.toString());
      jest
        .spyOn(avatarRepository, 'saveImage')
        .mockResolvedValue({ imageId: '1', imageData: avatarBase64 });
      jest
        .spyOn(avatarRepository, 'findImageById')
        .mockResolvedValue({ imageId: '1', imageData: avatarBase64 });

      // Act
      const result = await avatarService.getUserAvatar(1);

      // Assert
      expect(result).toEqual(avatarBase64.toString());
    });

    it('should throw a NotFoundException when given an invalid user ID', async () => {
      // Arrange
      jest.spyOn(avatarRepository, 'getUserById').mockResolvedValue(null);

      // Act and assert
      await expect(avatarService.getUserAvatar(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an Error when an error occurs while downloading the image', async () => {
      // Arrange
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };

      jest.spyOn(avatarRepository, 'getUserById').mockResolvedValue(user);
      jest
        .spyOn(imageService, 'downloadImage')
        .mockRejectedValue(new Error('Error downloading image'));

      // Act and assert
      await expect(avatarService.getUserAvatar(1)).rejects.toThrow(Error);
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

      const image = {
        imageId: '1',
        imageData: Buffer.from('response.data', 'binary'),
      } as Avatar;

      // Mock UserRepository methods
      jest.spyOn(avatarRepository, 'getUserById').mockResolvedValue(user);
      jest.spyOn(avatarRepository, 'findImageById').mockResolvedValue(image);
      jest
        .spyOn(avatarRepository, 'removeEntryFromDB')
        .mockResolvedValue(undefined);

      await avatarService.deleteAvatar(userId);

      // Verify UserRepository method calls
      expect(avatarRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(avatarRepository.findImageById).toHaveBeenCalledWith(user.id);
      expect(avatarRepository.removeEntryFromDB).toHaveBeenCalledWith(user.id);
    });

    it('should throw an exception if user is not found', async () => {
      const userId = 1;

      // Mock UserRepository getUserById method to return null
      jest.spyOn(avatarRepository, 'getUserById').mockResolvedValue(null);

      await expect(avatarService.deleteAvatar(userId)).rejects.toThrow(
        'Not Found',
      );

      // Verify UserRepository method call
      expect(avatarRepository.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
