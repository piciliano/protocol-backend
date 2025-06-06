import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { RequestStatus } from '@prisma/client';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('RequestService', () => {
  let service: RequestService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    request: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RequestService>(RequestService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: JwtPayload = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  };

  const mockCreateRequestDto: CreateRequestDto = {
    name: 'Test Request',
    description: 'Test Description',
    street: 'Test Street',
    neighborhood: 'Test Neighborhood',
    city: 'Test City',
    state: 'Test State',
    zipcode: '12345-678',
    status: RequestStatus.PENDENTE,
  };

  describe('create', () => {
    it('should create a request successfully', async () => {
      const expectedRequest = {
        id: '1',
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: expect.any(String),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.request.create.mockResolvedValueOnce(expectedRequest);

      const result = await service.create(mockCreateRequestDto, mockUser);

      expect(result).toEqual(expectedRequest);
      expect(mockPrismaService.request.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateRequestDto,
          userId: mockUser.id,
          protocol: expect.any(String),
        },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.request.create.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.create(mockCreateRequestDto, mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getRequestsForUser', () => {
    it('should return all requests for a user', async () => {
      const expectedRequests = [
        {
          id: '1',
          ...mockCreateRequestDto,
          userId: mockUser.id,
          protocol: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
          photos: [],
        },
      ];

      mockPrismaService.request.findMany.mockResolvedValueOnce(expectedRequests);

      const result = await service.getRequestsForUser(mockUser);

      expect(result).toEqual(expectedRequests);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { photos: true },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.request.findMany.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.getRequestsForUser(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all requests', async () => {
      const expectedRequests = [
        {
          id: '1',
          ...mockCreateRequestDto,
          userId: mockUser.id,
          protocol: '123456',
          createdAt: new Date(),
          updatedAt: new Date(),
          photos: [],
          user: mockUser,
        },
      ];

      mockPrismaService.request.findMany.mockResolvedValueOnce(expectedRequests);

      const result = await service.findAll();

      expect(result).toEqual(expectedRequests);
      expect(mockPrismaService.request.findMany).toHaveBeenCalledWith({
        include: { photos: true, user: true },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.request.findMany.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    const requestId = '1';

    it('should return a request by id', async () => {
      const expectedRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      mockPrismaService.request.findUnique.mockResolvedValueOnce(expectedRequest);

      const result = await service.findOne(requestId);

      expect(result).toEqual(expectedRequest);
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: requestId },
        include: { photos: true },
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(requestId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.request.findUnique.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findOne(requestId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const requestId = '1';
    const updateRequestDto: UpdateRequestDto = {
      status: RequestStatus.EM_ANDAMENTO,
    };

    it('should update a request successfully', async () => {
      const existingRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      const updatedRequest = {
        ...existingRequest,
        ...updateRequestDto,
      };

      mockPrismaService.request.findUnique.mockResolvedValueOnce(existingRequest);
      mockPrismaService.request.update.mockResolvedValueOnce(updatedRequest);

      const result = await service.update(requestId, updateRequestDto);

      expect(result).toEqual(updatedRequest);
      expect(mockPrismaService.request.update).toHaveBeenCalledWith({
        where: { id: requestId },
        data: updateRequestDto,
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(requestId, updateRequestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const existingRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      mockPrismaService.request.findUnique.mockResolvedValueOnce(existingRequest);
      mockPrismaService.request.update.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.update(requestId, updateRequestDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    const requestId = '1';

    it('should remove a request successfully', async () => {
      const existingRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      mockPrismaService.request.findUnique.mockResolvedValueOnce(existingRequest);
      mockPrismaService.request.delete.mockResolvedValueOnce(undefined);

      await service.remove(requestId);

      expect(mockPrismaService.request.delete).toHaveBeenCalledWith({
        where: { id: requestId },
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(requestId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const existingRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      mockPrismaService.request.findUnique.mockResolvedValueOnce(existingRequest);
      mockPrismaService.request.delete.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.remove(requestId)).rejects.toThrow(InternalServerErrorException);
    });
  });
}); 