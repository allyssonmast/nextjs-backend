import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../schemas/user.schema';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from './support/user.modal';

const mockUserApi = () => ({
  findById: jest.fn(),
});

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useClass: UserModel,
        },
        {
          provide: 'IUserApi',
          useFactory: mockUserApi,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<UserModel>(getModelToken(User.name));
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const userDto: UserDto = {
        email: 'test@test.com',
        first_name: 'John',
        password: '123456',
        last_name: 'Doe',
        avatar: 'avatar.jpg',
      };
      const createdUser: UserEntity = {
        id: 123,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'avatar.jpg',
      };
      const mongooseResponse = {
        id: 123,
        email: 'test@test.com',
        first_name: 'John',
        password: '123456',
        last_name: 'Doe',
        avatar: 'avatar.jpg',
      };
      jest
        .spyOn(UserModel.prototype, 'create')
        .mockResolvedValueOnce(mongooseResponse);
      const result = await userRepository.createUser(userDto);
      expect(UserModel.prototype.create).toHaveBeenCalledWith(userDto);
      const { password, ...userEntity } = result; // is mocking .toJSON() from user.schema.ts
      expect(userEntity).toEqual(createdUser);
    });

    it('should throw BadRequestException when fails to create user', async () => {
      const userDto: UserDto = {
        email: 'test@test.com',
        first_name: 'John',
        password: '123456',
        last_name: 'Doe',
        avatar: 'avatar.jpg',
      };
      const error = new Error('Failed to create user');

      jest.spyOn(UserModel.prototype, 'create').mockRejectedValueOnce(error);
      await expect(userRepository.createUser(userDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user when a valid email is provided', async () => {
      const email = 'johndoe@test.com';
      const expectedUser = {
        id: 1,
        email,
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'https://via.placeholder.com/150',
      };

      jest
        .spyOn(UserModel.prototype, 'findOne')
        .mockReturnValue({ exec: () => expectedUser as any });

      const result = await userRepository.findByEmail(email);

      expect(result).toEqual(expectedUser);
    });

    it('should throw a BadRequestException when a non-existent email is provided', async () => {
      const email = 'nonexistent@test.com';

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new BadRequestException()),
      });
      await expect(userRepository.findByEmail(email)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
