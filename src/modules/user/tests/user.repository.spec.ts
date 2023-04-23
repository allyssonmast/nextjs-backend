import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmailValidator } from '../../../utils/helpers/email.validator';

import { UserRepository } from '../repository/user.repository';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  let userApi: any;
  let emailValidation: EmailValidator;
  let userModel: any;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn().mockResolvedValue(null),
    };

    userApi = {
      findById: jest.fn(),
    };
    emailValidation = {
      validateEmail: jest.fn().mockResolvedValue(true),
    } as EmailValidator;

    userRepository = new UserRepository(userModel, userApi, emailValidation);
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

        mockEmailValidation as any,
      );

      await expect(userRepository.createUser(user)).rejects.toThrowError(
        'Create user failed',
      );
    });
  });

  describe('getUserById', () => {
    it('should call userApi.findById with the correct userId', async () => {
      // Arrange
      const userId = 123;
      userApi.findById.mockResolvedValue({});

      // Act
      await userRepository.getUserById(userId);

      // Assert
      expect(userApi.findById).toHaveBeenCalledWith(userId);
    });

    it('should return the user found by userApi.findById', async () => {
      // Arrange
      const userId = 123;
      const user = { _id: userId, email: 'test@example.com' };
      userApi.findById.mockResolvedValue(user);

      // Act
      const result = await userRepository.getUserById(userId);

      // Assert
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should call userModel.findOne with the correct email', async () => {
      // Arrange
      const email = 'test@example.com';
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });

      // Act
      await userRepository.findByEmail(email);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return null if user is not found', async () => {
      // Arrange
      const email = 'test@example.com';
      userModel.findOne.mockReturnValue(null);

      // Act
      const result = await userRepository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
    });

    it('should return the user found by userModel.findOne', async () => {
      // Arrange
      const email = 'test@example.com';
      const user = { _id: 123, email };
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      // Act
      const result = await userRepository.findByEmail(email);

      // Assert
      expect(result).toEqual(user);
    });
  });
});
