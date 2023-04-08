import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EmailService } from '../../../../utils/helpers/email.validator';
import { Image } from '../schemas/avatar.schema';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let imageModel: Model<Image>;
  let userApi: any;
  let emailValidation: EmailService;
  let userModel: any;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn().mockResolvedValue(null),
    };
    imageModel = {} as any;
    userApi = {} as any;
    emailValidation = {
      validateEmail: jest.fn().mockResolvedValue(true),
    } as EmailService;

    userRepository = new UserRepository(
      userModel,
      imageModel,
      userApi,
      emailValidation,
    );
  });

  describe('createUser', () => {
    it('should throw BadRequestException if any required property is missing', async () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar: 'test-avatar',
      };

      // Act + Assert
      await expect(
        userRepository.createUser({ ...user, email: undefined }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        userRepository.createUser({ ...user, first_name: undefined }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        userRepository.createUser({ ...user, last_name: undefined }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        userRepository.createUser({ ...user, avatar: undefined }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user email is invalid', async () => {
      // Arrange
      const user = {
        email: 'invalid-email',
        first_name: 'Test',
        last_name: 'User',
        avatar: 'test-avatar',
      };

      (emailValidation.validateEmail as jest.Mock).mockResolvedValue(false);

      // Act + Assert
      await expect(userRepository.createUser(user)).rejects.toThrow(
        BadRequestException,
      );
      expect(emailValidation.validateEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw NotFoundException if user with same email already exists', async () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar: 'test-avatar',
      };

      userRepository.findByEmail = jest.fn().mockResolvedValue({});

      // Act + Assert
      await expect(userRepository.createUser(user)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
    });

    /*
    it('should create user if all validations pass', async () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        avatar: 'test-avatar',
      };

      userRepository.findByEmail = jest.fn().mockResolvedValue(false);

      const saveMock = jest.fn().mockResolvedValue({ _id: 123, ...user });
      (userModel.save as jest.Mock).mockReturnValueOnce({
        save: saveMock,
      });

      (emailValidation.validateEmail as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await userRepository.createUser(user);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(user.email);
      expect(emailValidation.validateEmail).toHaveBeenCalledWith(user.email);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ _id: 123, ...user });
    });
    */

    it('should throw error if there is an issue with saving user', async () => {
      // Arrange
      const user = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'Doe',
        avatar: 'avatar-url',
      };
      const mockEmailValidation = {
        validateEmail: jest.fn().mockReturnValue(true),
      };

      const mockUserModel = {
        findOne: jest.fn().mockReturnValue(null),
        create: jest.fn().mockRejectedValue(new Error('Create user failed')),
      };

      const userRepository = new UserRepository(
        mockUserModel as any,
        {} as any,
        {} as any,
        mockEmailValidation as any,
      );

      await expect(userRepository.createUser(user)).rejects.toThrowError(
        'Create user failed',
      );
    });
  });
});
