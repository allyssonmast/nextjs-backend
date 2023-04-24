import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NotificationService } from '../../../utils/helpers/notification.service';
import { UserService } from '../user.service';
import { UserDto } from '../dto/user.dto';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { userStub } from './stubs/user.stub';
import { UserAlreadyExistsException } from '../../../utils/errors/user.exception.error';

describe('UserService', () => {
  let service: UserService;
  let userRepository: IUserRepository;
  let notificationService: NotificationService;
  const userRepositoryMock: IUserRepository = {
    findById: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    createUser: jest.fn(),
  };
  beforeEach(() => {
    userRepository = userRepositoryMock as any;
    notificationService = {
      sendEmailNotification: jest.fn(),
    } as any;
    service = new UserService(userRepository, notificationService);
  });

  describe('getUserById', () => {
    it('should return the user with the given id', async () => {
      const userStubData = userStub();
      jest.spyOn(userRepository, 'findById').mockResolvedValue(userStubData);

      const result = await service.getUserById(1);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(userStubData);
    });

    it('should throw a NotFoundException if no user with the given id is found', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(service.getUserById(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    let userDto: UserDto;

    beforeEach(() => {
      userDto = {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'http://example.com/avatar.jpg',
      };
    });

    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(userStub());

      const result = await service.createUser(userDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
      expect(userRepository.createUser).toHaveBeenCalledWith(userDto);
      expect(notificationService.sendEmailNotification).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw a UserAlreadyExistsFilter if a user with the same email already exists', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(userStub());

      await expect(service.createUser(userDto)).rejects.toThrowError(
        UserAlreadyExistsException,
      );
    });

    it('should throw a BadRequestException if an error occurs during user creation', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(undefined);
      jest.spyOn(userRepository, 'createUser').mockRejectedValue(new Error());

      await expect(service.createUser(userDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
