import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';

describe('User Test suite', () => {
  let userService: UserService;

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'moncef',
        email: 'moncef@gmail.com',
        password: '12345678',
      };

      const expectedResult = {
        username: 'moncef',
        email: 'moncef@gmail.com',
      };

      const mockCreatedUser = {
        username: 'moncef',
        email: 'moncef@gmail.com',
      };
      mockUserModel.create.mockReturnValue(mockCreatedUser);

      // Act
      const result = await userService.create(createUserDto);

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    it('should handle duplicate email error', async () => {
      const createUserDto: CreateUserDto = {
        username: 'moncef',
        email: 'moncef@gmail.com',
        password: '12345678',
      };

      const mockError = {
        code: 11000, // Simulate a duplicate key error
      };

      mockUserModel.create.mockRejectedValue(mockError);

      try {
        await userService.create(createUserDto);
      } catch (error) {
        expect(error.response.message).toBe('Email already used');
      }
    });
  });

  describe('findOne', () => {
    it('should find the user', async () => {
      // arrange
      const user: Partial<User> = {
        id: '452145457824578451658495',
        username: 'moncef',
        email: 'moncef@gmail.com',
        password: '12345678',
      };

      mockUserModel.findById.mockResolvedValue(user);

      // act
      const result = await userService.findOne(user.id);

      // asert
      expect(result).toStrictEqual(user);
    });

    it('should handle user not found error', async () => {
      // arrange
      const userId = '4578545885455785';

      mockUserModel.findById.mockReturnValue(null);

      try {
        // act
        await userService.findOne(userId);
      } catch (err) {
        //assert
        expect(err.response.message).toBe('User Not found');
      }
    });
  });

  describe('findByMail', async () => {
    // Arrange
    // Act
    // Assert
  });
});
