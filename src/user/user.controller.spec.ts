import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateRoleByEmail: jest.fn(),
    remove: jest.fn(),
    requestPasswordRecovery: jest.fn(),
    validateRecoveryCode: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.create.mockResolvedValueOnce(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserService.findAll.mockResolvedValueOnce(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should request password recovery', async () => {
      const email = 'test@example.com';
      const expectedResult = {
        message: 'Se o e-mail existir, um código de recuperação foi enviado.',
      };

      mockUserService.requestPasswordRecovery.mockResolvedValueOnce(expectedResult);

      const result = await controller.forgotPassword(email);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.requestPasswordRecovery).toHaveBeenCalledWith(email);
    });
  });

  describe('validateCode', () => {
    it('should validate recovery code', async () => {
      const code = 'ABC123';
      const expectedResult = { message: 'Código validado com sucesso.' };

      mockUserService.validateRecoveryCode.mockResolvedValueOnce(expectedResult);

      const result = await controller.validateCode(code);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.validateRecoveryCode).toHaveBeenCalledWith(code);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const newPassword = 'newPassword123';
      const expectedResult = { message: 'Senha atualizada com sucesso.' };

      mockUserService.resetPassword.mockResolvedValueOnce(expectedResult);

      const result = await controller.resetPassword(newPassword);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.resetPassword).toHaveBeenCalledWith(newPassword);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedResult = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findOne.mockResolvedValueOnce(expectedResult);

      const result = await controller.findOne(userId);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const expectedResult = {
        id: userId,
        name: updateUserDto.name,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.update.mockResolvedValueOnce(expectedResult);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('updateRoleByEmail', () => {
    it('should update user role by email', async () => {
      const email = 'test@example.com';
      const role = Role.ADMIN;

      const expectedResult = {
        id: '1',
        name: 'Test User',
        email,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.updateRoleByEmail.mockResolvedValueOnce(expectedResult);

      const result = await controller.updateRoleByEmail(email, role);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.updateRoleByEmail).toHaveBeenCalledWith(email, role);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';

      mockUserService.remove.mockResolvedValueOnce(undefined);

      await controller.remove(userId);

      expect(mockUserService.remove).toHaveBeenCalledWith(userId);
    });
  });
}); 