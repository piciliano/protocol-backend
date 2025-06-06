import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let emailService: EmailService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    passwordRecovery: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const expectedUser = {
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      mockPrismaService.user.create.mockResolvedValueOnce(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
        select: { email: true },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });
    });

    it('should throw HttpException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ email: createUserDto.email });

      await expect(service.create(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all users successfully', async () => {
      const expectedUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValueOnce(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.user.findMany.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    const userId = '1';

    it('should return a user successfully', async () => {
      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(expectedUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const userId = '1';
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    it('should update a user successfully', async () => {
      const existingUser = {
        id: userId,
        name: 'Old Name',
        email: 'test@example.com',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...existingUser, ...updateUserDto };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRoleByEmail', () => {
    const email = 'test@example.com';
    const newRole = Role.ADMIN;

    it('should update user role successfully', async () => {
      const existingUser = {
        id: '1',
        name: 'Test User',
        email,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...existingUser, role: newRole };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.updateRoleByEmail(email, newRole);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { email },
        data: { role: newRole },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.updateRoleByEmail(email, newRole)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const userId = '1';

    it('should remove a user successfully', async () => {
      const existingUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrismaService.user.delete.mockResolvedValueOnce(undefined);

      await service.remove(userId);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('requestPasswordRecovery', () => {
    const email = 'test@example.com';
    const user = {
      id: '1',
      name: 'Test User',
      email,
    };

    it('should create password recovery request successfully', async () => {
      const recoveryCode = 'ABC123';
      const hashedCode = 'hashedABC123';
      
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedCode);
      mockPrismaService.passwordRecovery.create.mockResolvedValueOnce({});
      mockEmailService.sendEmail.mockResolvedValueOnce(undefined);

      const result = await service.requestPasswordRecovery(email);

      expect(result).toEqual({
        message: 'Se o e-mail existir, um código de recuperação foi enviado.',
      });
      expect(mockPrismaService.passwordRecovery.create).toHaveBeenCalled();
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });

    it('should return success message even if email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.requestPasswordRecovery(email);

      expect(result).toEqual({
        message: 'Se o e-mail existir, um código de recuperação foi enviado.',
      });
      expect(mockPrismaService.passwordRecovery.create).not.toHaveBeenCalled();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('validateRecoveryCode', () => {
    const code = 'ABC123';

    it('should validate recovery code successfully', async () => {
      const recovery = {
        id: '1',
        userId: '1',
        codeHash: 'hashedCode',
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        isValidated: false,
      };

      mockPrismaService.passwordRecovery.findMany.mockResolvedValueOnce([recovery]);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      mockPrismaService.passwordRecovery.update.mockResolvedValueOnce({});

      const result = await service.validateRecoveryCode(code);

      expect(result).toEqual({ message: 'Código validado com sucesso.' });
      expect(mockPrismaService.passwordRecovery.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid code', async () => {
      mockPrismaService.passwordRecovery.findMany.mockResolvedValueOnce([]);

      await expect(service.validateRecoveryCode(code)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    const newPassword = 'newPassword123';

    it('should reset password successfully', async () => {
      const recovery = {
        id: '1',
        userId: '1',
        isValidated: true,
        validatedAt: new Date(),
      };

      const hashedPassword = 'hashedNewPassword123';

      mockPrismaService.passwordRecovery.findFirst.mockResolvedValueOnce(recovery);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      mockPrismaService.user.update.mockResolvedValueOnce({});
      mockPrismaService.passwordRecovery.delete.mockResolvedValueOnce({});

      const result = await service.resetPassword(newPassword);

      expect(result).toEqual({ message: 'Senha atualizada com sucesso.' });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: recovery.userId },
        data: { password: hashedPassword },
      });
      expect(mockPrismaService.passwordRecovery.delete).toHaveBeenCalledWith({
        where: { id: recovery.id },
      });
    });

    it('should throw BadRequestException if no valid recovery found', async () => {
      mockPrismaService.passwordRecovery.findFirst.mockResolvedValueOnce(null);

      await expect(service.resetPassword(newPassword)).rejects.toThrow(BadRequestException);
    });
  });
}); 