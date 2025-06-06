import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { createClient } from '@supabase/supabase-js';
import { Role, RequestStatus } from '@prisma/client';

jest.mock('@supabase/supabase-js');

describe('PhotoController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let mockSupabaseClient: any;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRequest = {
    id: 'request-123',
    name: 'Test Request',
    description: 'Test Description',
    userId: mockUser.id,
    street: 'Test Street',
    neighborhood: 'Test Neighborhood',
    city: 'Test City',
    state: 'Test State',
    zipcode: '12345-678',
    protocol: '2024123456',
    status: RequestStatus.PENDENTE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    mockSupabaseClient = {
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_KEY = 'mock-key';

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.photo.deleteMany();
    await prismaService.passwordRecovery.deleteMany();
    await prismaService.request.deleteMany();
    await prismaService.user.deleteMany();

    await prismaService.user.create({
      data: mockUser,
    });

    await prismaService.request.create({
      data: mockRequest,
    });

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prismaService.photo.deleteMany();
    await prismaService.passwordRecovery.deleteMany();
    await prismaService.request.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('/photo/:id (POST)', () => {
    const mockUploadResponse = {
      error: null,
      data: { path: 'test.jpg' },
    };

    const mockPublicUrlResponse = {
      data: { publicUrl: 'https://example.supabase.co/test.jpg' },
    };

    it('should upload photos successfully', async () => {
      mockSupabaseClient.storage
        .from()
        .upload.mockResolvedValueOnce(mockUploadResponse);
      mockSupabaseClient.storage
        .from()
        .getPublicUrl.mockReturnValueOnce(mockPublicUrlResponse);

      const response = await request(app.getHttpServer())
        .post(`/photo/${mockRequest.id}`)
        .attach('files', Buffer.from('test'), { filename: 'test.jpg' })
        .expect(201);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        url: mockPublicUrlResponse.data.publicUrl,
        requestId: mockRequest.id,
      });

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('protocol');
      expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith(
        'test.jpg',
        expect.any(Buffer),
        { upsert: true },
      );
    });

    it('should return 400 when no files are provided', async () => {
      const response = await request(app.getHttpServer())
        .post(`/photo/${mockRequest.id}`)
        .expect(400);

      expect(response.body.message).toBe('Nenhum arquivo enviado.');
      expect(mockSupabaseClient.storage.from().upload).not.toHaveBeenCalled();
    });

    it('should return 400 when more than 5 files are provided', async () => {
      const files = [
        { buffer: Buffer.from('test1'), name: 'test1.jpg' },
        { buffer: Buffer.from('test2'), name: 'test2.jpg' },
        { buffer: Buffer.from('test3'), name: 'test3.jpg' },
        { buffer: Buffer.from('test4'), name: 'test4.jpg' },
        { buffer: Buffer.from('test5'), name: 'test5.jpg' },
        { buffer: Buffer.from('test6'), name: 'test6.jpg' },
      ];

      const req = request(app.getHttpServer())
        .post(`/photo/${mockRequest.id}`)
        .set('Content-Type', 'multipart/form-data');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        mockSupabaseClient.storage
          .from()
          .upload.mockResolvedValueOnce(mockUploadResponse);
        mockSupabaseClient.storage
          .from()
          .getPublicUrl.mockReturnValueOnce(mockPublicUrlResponse);
        req.attach('files', file.buffer, { filename: file.name });
      }

      const response = await req;

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Unexpected field - files');
      expect(mockSupabaseClient.storage.from().upload).not.toHaveBeenCalled();
    });

    it('should return 500 when request is not found', async () => {
      const nonExistentRequestId = 'non-existent-123';

      const response = await request(app.getHttpServer())
        .post(`/photo/${nonExistentRequestId}`)
        .attach('files', Buffer.from('test'), { filename: 'test.jpg' })
        .expect(500);

      expect(response.body.message).toBe('Erro ao fazer upload de imagens');
      expect(response.body.error).toBe('Requisição não encontrada');
      expect(mockSupabaseClient.storage.from().upload).not.toHaveBeenCalled();
    });

    it('should return 500 when upload fails', async () => {
      const mockBucket = {
        upload: jest.fn().mockRejectedValue(new Error('Upload failed')),
        getPublicUrl: jest.fn(),
      };

      mockSupabaseClient.storage.from.mockReturnValue(mockBucket);

      const response = await request(app.getHttpServer())
        .post(`/photo/${mockRequest.id}`)
        .attach('files', Buffer.from('test'), { filename: 'test.jpg' })
        .expect(500);

      expect(response.body.message).toBe('Erro ao fazer upload de imagens');
      expect(response.body.error).toBe('Upload failed');
      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('protocol');
      expect(mockBucket.upload).toHaveBeenCalledWith(
        'test.jpg',
        expect.any(Buffer),
        { upsert: true },
      );
    });
  });
});
