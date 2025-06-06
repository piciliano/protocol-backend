import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { PrismaService } from 'prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

jest.mock('@supabase/supabase-js');

describe('PhotoService', () => {
  let service: PhotoService;
  let prismaService: PrismaService;
  let mockSupabaseClient: any;

  const mockPrismaService = {
    request: {
      findUnique: jest.fn(),
    },
    photo: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    mockSupabaseClient = {
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    prismaService = module.get<PrismaService>(PrismaService);

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_KEY = 'mock-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockRequestId = 'request-123';
    const mockFiles = [
      {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
      },
    ] as Express.Multer.File[];

    const mockRequest = {
      id: mockRequestId,
      name: 'Test Request',
    };

    const mockUploadResponse = {
      error: null,
      data: { path: 'test.jpg' },
    };

    const mockPublicUrlResponse = {
      data: { publicUrl: 'https://example.com/test.jpg' },
    };

    const mockSavedPhoto = {
      id: 'photo-123',
      url: 'https://example.com/test.jpg',
      requestId: mockRequestId,
    };

    it('should successfully upload photos and create records', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(mockRequest);
      mockSupabaseClient.storage.from().upload.mockResolvedValueOnce(mockUploadResponse);
      mockSupabaseClient.storage.from().getPublicUrl.mockReturnValueOnce(mockPublicUrlResponse);
      mockPrismaService.photo.create.mockResolvedValueOnce(mockSavedPhoto);

      const result = await service.create(mockFiles, mockRequestId);

      expect(result).toEqual([mockSavedPhoto]);
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: mockRequestId },
      });
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('protocol');
      expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith(
        mockFiles[0].originalname,
        mockFiles[0].buffer,
        { upsert: true },
      );
      expect(mockPrismaService.photo.create).toHaveBeenCalledWith({
        data: {
          url: mockPublicUrlResponse.data.publicUrl,
          requestId: mockRequestId,
        },
      });
    });

    it('should throw NotFoundException when request is not found', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(null);

      try {
        await service.create(mockFiles, mockRequestId);
        fail('should have thrown NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro ao fazer upload de imagens',
          error: 'Requisição não encontrada',
        });
      }

      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: mockRequestId },
      });
      expect(mockSupabaseClient.storage.from().upload).not.toHaveBeenCalled();
    });

    it('should throw error when upload fails', async () => {
      mockPrismaService.request.findUnique.mockResolvedValueOnce(mockRequest);
      mockSupabaseClient.storage.from().upload.mockResolvedValueOnce({
        error: new Error('Upload failed'),
      });

      await expect(service.create(mockFiles, mockRequestId)).rejects.toThrow();
      expect(mockPrismaService.request.findUnique).toHaveBeenCalledWith({
        where: { id: mockRequestId },
      });
      expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalled();
      expect(mockPrismaService.photo.create).not.toHaveBeenCalled();
    });
  });
}); 