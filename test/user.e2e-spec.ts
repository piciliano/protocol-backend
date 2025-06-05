import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let access_token: string;
  let user_token: string;
  let adminId: string;
  let userId: string;

  const mockAdmin = {
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'hashed_password',
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    email: 'user@example.com',
    name: 'Test User',
    password: 'hashed_password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.photo.deleteMany();
    await prismaService.request.deleteMany();
    await prismaService.passwordRecovery.deleteMany();
    await prismaService.user.deleteMany();

    const admin = await prismaService.user.create({
      data: mockAdmin,
    });
    adminId = admin.id;

    const user = await prismaService.user.create({
      data: mockUser,
    });
    userId = user.id;

    access_token = jwtService.sign({
      id: adminId,
      email: mockAdmin.email,
      role: mockAdmin.role,
      name: mockAdmin.name,
    });

    user_token = jwtService.sign({
      id: userId,
      email: mockUser.email,
      role: mockUser.role,
      name: mockUser.name,
    });
  });

  afterAll(async () => {
    await prismaService.photo.deleteMany();
    await prismaService.request.deleteMany();
    await prismaService.passwordRecovery.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('/user (POST)', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(201);

      expect(response.body).toMatchObject({
        name: newUser.name,
        email: newUser.email,
      });
    });

    it('should not create a user with existing email', async () => {
      const newUser = {
        name: 'Duplicate User',
        email: mockUser.email,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(400);

      expect(response.body.message).toBe('Email já existe.');

      const users = await prismaService.user.findMany();
      expect(users).toHaveLength(2); // Apenas admin e user inicial
    });
  });

  describe('/user (GET)', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${user_token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: adminId,
            name: mockAdmin.name,
            email: mockAdmin.email,
          }),
          expect.objectContaining({
            id: userId,
            name: mockUser.name,
            email: mockUser.email,
          }),
        ]),
      );
    });

    it('should return 401 when no token is provided', async () => {
      await request(app.getHttpServer()).get('/user').expect(401);
    });
  });

  describe('/user/:id (GET)', () => {
    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it('should return 404 when user not found', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app.getHttpServer())
        .get(`/user/${nonExistentId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('/user/:id (PATCH)', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        name: updateData.name,
        email: mockUser.email,
      });
    });

    it('should not update to an existing email', async () => {
      const updateData = {
        email: mockAdmin.email,
      };

      const response = await request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send(updateData)
        .expect(500);

      expect(response.body.message).toContain(
        'Unique constraint failed on the fields: (`email`)',
      );
    });
  });

  describe('/user/by-email/:email (PATCH)', () => {
    it('should update user role by email', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/user/by-email/${mockUser.email}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({ role: Role.ADMIN })
        .expect(200);

      expect(response.body).toMatchObject({
        email: mockUser.email,
        role: Role.ADMIN,
      });
    });

    it('should return 404 when user not found', async () => {
      const nonExistentEmail = 'nonexistent@example.com';

      const response = await request(app.getHttpServer())
        .patch(`/user/by-email/${nonExistentEmail}`)
        .set('Authorization', `Bearer ${access_token}`)
        .send({ role: Role.ADMIN })
        .expect(404);

      expect(response.body.message).toBe(
        `User with email ${nonExistentEmail} not found`,
      );
    });

    it('should return 403 when non-admin tries to update role', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/user/by-email/${mockUser.email}`)
        .set('Authorization', `Bearer ${user_token}`)
        .send({ role: Role.ADMIN })
        .expect(403);

      expect(response.body.message).toBe('Acesso negado');
    });
  });

  describe('/user/:id (DELETE)', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      const user = await prismaService.user.findUnique({
        where: { id: userId },
      });

      expect(user).toBeNull();
    });

    it('should return 404 when user not found', async () => {
      const nonExistentId = 'non-existent-id';

      const response = await request(app.getHttpServer())
        .delete(`/user/${nonExistentId}`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });
});
