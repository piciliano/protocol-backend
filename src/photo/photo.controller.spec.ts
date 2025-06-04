import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { BadRequestException } from '@nestjs/common';

describe('PhotoController', () => {
  let controller: PhotoController;
  let photoService: PhotoService;

  const mockPhotoService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        {
          provide: PhotoService,
          useValue: mockPhotoService,
        },
      ],
    }).compile();

    controller = module.get<PhotoController>(PhotoController);
    photoService = module.get<PhotoService>(PhotoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockRequestId = 'request-123';
    const mockFiles = [
      {
        originalname: 'test1.jpg',
        buffer: Buffer.from('test1'),
      },
      {
        originalname: 'test2.jpg',
        buffer: Buffer.from('test2'),
      },
    ] as Express.Multer.File[];

    const mockSavedPhotos = [
      {
        id: 'photo-1',
        url: 'https://example.com/test1.jpg',
        requestId: mockRequestId,
      },
      {
        id: 'photo-2',
        url: 'https://example.com/test2.jpg',
        requestId: mockRequestId,
      },
    ];

    it('should successfully create photos', async () => {
      mockPhotoService.create.mockResolvedValueOnce(mockSavedPhotos);

      const result = await controller.create(mockRequestId, mockFiles);

      expect(result).toEqual(mockSavedPhotos);
      expect(mockPhotoService.create).toHaveBeenCalledWith(mockFiles, mockRequestId);
    });

    it('should throw BadRequestException when no files are provided', async () => {
      try {
        await controller.create(mockRequestId, []);
        fail('should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Nenhum arquivo enviado.');
      }
      expect(mockPhotoService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when more than 5 files are provided', async () => {
      const tooManyFiles = Array(6).fill({
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
      }) as Express.Multer.File[];

      try {
        await controller.create(mockRequestId, tooManyFiles);
        fail('should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Você pode enviar no máximo 5 imagens.');
      }
      expect(mockPhotoService.create).not.toHaveBeenCalled();
    });
  });
}); 