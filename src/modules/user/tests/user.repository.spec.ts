import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../repository/user.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { EmailValidator } from '../../../utils/helpers/email.validator';
import { IUserApi } from '../../../utils/interfaces/user-api.interface';
import { userStub } from './stubs/user.stub';
import { UserModel } from './support/user.modal';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: UserModel;
  let userApi: IUserApi;
  let emailValidator: EmailValidator;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
        {
          provide: 'IUserApi',
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: EmailValidator,
          useValue: {
            validateEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    userModel = moduleRef.get<UserModel>(getModelToken(User.name));
    userApi = moduleRef.get<IUserApi>('IUserApi');
    emailValidator = moduleRef.get<EmailValidator>(EmailValidator);
  });
  describe('createUser', () => {
    it('should throw BadRequestException if user fields are not provided', async () => {
      const user = {
        email: '',
        first_name: '',
        last_name: '',
        avatar: '',
      };
      await expect(userRepository.createUser(user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if email is not valid', async () => {
      const user = {
        email: 'invalidemail',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'http://example.com/avatar.jpg',
      };
      jest.spyOn(emailValidator, 'validateEmail').mockResolvedValue(false);
      await expect(userRepository.createUser(user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user with provided email already exists', async () => {
      const user = userStub();
      jest.spyOn(emailValidator, 'validateEmail').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
      await expect(userRepository.createUser(user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create and return a user if input is valid and user does not exist', async () => {
      const user = userStub();

      jest.spyOn(emailValidator, 'validateEmail').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, 'save').mockResolvedValue(user);
      const createdUser = await userRepository.createUser(user);
      expect(createdUser).toEqual(user);
    });

    it('should throw an error if user creation fails', async () => {
      const user = userStub();
      jest.spyOn(emailValidator, 'validateEmail').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(UserModel.prototype, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(userRepository.createUser(user)).rejects.toThrowError(
        'Create user failed',
      );
    });
  });
  describe('findByEmail', () => {
    it('should throw error when user is not found', async () => {
      jest.spyOn(UserModel.prototype, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(new Error('Not found')),
      } as any);

      const result = await userRepository.findByEmail('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).rejects.toThrowError('Not found');
    });

    it('should return the user when found', async () => {
      const user = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'avatar.png',
      };

      jest.spyOn(UserModel.prototype, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(user),
      } as any);

      const result = await userRepository.findByEmail('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(user);
    });
  });
});
