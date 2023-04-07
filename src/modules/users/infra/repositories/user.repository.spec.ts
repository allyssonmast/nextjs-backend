import { UserRepository } from './user.repository';
import { Model } from 'mongoose';
import { UserApi } from '../database/rest.api/user.api';
import { BadRequestException } from '@nestjs/common';

describe('UserRepository - createUser', () => {
  let userRepository: UserRepository;
  let userModelMock: Model<any>;
  let imageModelMock: Model<any>;
  let userApiMock: UserApi;

  beforeEach(() => {
    userRepository = new UserRepository(
      userModelMock,
      imageModelMock,
      userApiMock,
    );
  });

  it('should throw BadRequestException with missing parameters', async () => {
    const userData = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    };

    await expect(userRepository.createUser(userData)).rejects.toThrow(
      BadRequestException,
    );
  });
});
