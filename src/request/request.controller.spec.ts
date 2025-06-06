import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { PhotoService } from '../photo/photo.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { RequestStatus } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('RequestController', () => {
  let controller: RequestController;
  let requestService: RequestService;
  let photoService: PhotoService;

  const mockRequestService = {
    create: jest.fn(),
    getRequestsForUser: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPhotoService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
        {
          provide: PhotoService,
          useValue: mockPhotoService,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    requestService = module.get<RequestService>(RequestService);
    photoService = module.get<PhotoService>(PhotoService);
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
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequestService.create.mockResolvedValueOnce(expectedRequest);

      const result = await controller.create(mockCreateRequestDto, mockUser);

      expect(result).toEqual(expectedRequest);
      expect(mockRequestService.create).toHaveBeenCalledWith(mockCreateRequestDto, mockUser);
    });
  });

  describe('createWithPhoto', () => {
    const mockFiles: Express.Multer.File[] = [
      {
        fieldname: 'files',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File,
    ];

    it('should create a request with photos successfully', async () => {
      const expectedRequest = {
        id: '1',
        ...mockCreateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedPhotos = [
        {
          id: '1',
          url: 'http://example.com/photo.jpg',
          requestId: expectedRequest.id,
        },
      ];

      mockRequestService.create.mockResolvedValueOnce(expectedRequest);
      mockPhotoService.create.mockResolvedValueOnce(expectedPhotos);

      const result = await controller.createWithPhoto(mockFiles, mockCreateRequestDto, mockUser);

      expect(result).toEqual({
        ...expectedRequest,
        photos: expectedPhotos,
      });
      expect(mockRequestService.create).toHaveBeenCalledWith(mockCreateRequestDto, mockUser);
      expect(mockPhotoService.create).toHaveBeenCalledWith(mockFiles, expectedRequest.id);
    });

    it('should throw BadRequestException when no files are provided', async () => {
      await expect(controller.createWithPhoto([], mockCreateRequestDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRequestService.create).not.toHaveBeenCalled();
      expect(mockPhotoService.create).not.toHaveBeenCalled();
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

      mockRequestService.getRequestsForUser.mockResolvedValueOnce(expectedRequests);

      const result = await controller.getRequestsForUser(mockUser);

      expect(result).toEqual(expectedRequests);
      expect(mockRequestService.getRequestsForUser).toHaveBeenCalledWith(mockUser);
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

      mockRequestService.findAll.mockResolvedValueOnce(expectedRequests);

      const result = await controller.findAll();

      expect(result).toEqual(expectedRequests);
      expect(mockRequestService.findAll).toHaveBeenCalled();
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

      mockRequestService.findOne.mockResolvedValueOnce(expectedRequest);

      const result = await controller.findOne(requestId);

      expect(result).toEqual(expectedRequest);
      expect(mockRequestService.findOne).toHaveBeenCalledWith(requestId);
    });
  });

  describe('update', () => {
    const requestId = '1';
    const updateRequestDto: UpdateRequestDto = {
      status: RequestStatus.EM_ANDAMENTO,
    };

    it('should update a request successfully', async () => {
      const updatedRequest = {
        id: requestId,
        ...mockCreateRequestDto,
        ...updateRequestDto,
        userId: mockUser.id,
        protocol: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
      };

      mockRequestService.update.mockResolvedValueOnce(updatedRequest);

      const result = await controller.update(requestId, updateRequestDto);

      expect(result).toEqual(updatedRequest);
      expect(mockRequestService.update).toHaveBeenCalledWith(requestId, updateRequestDto);
    });
  });

  describe('remove', () => {
    const requestId = '1';

    it('should remove a request successfully', async () => {
      await controller.remove(requestId);

      expect(mockRequestService.remove).toHaveBeenCalledWith(requestId);
    });
  });
}); 