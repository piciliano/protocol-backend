import { Test } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { PrismaModule } from 'prisma/prisma.module';

describe('UserModule', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .compile();

    expect(module).toBeDefined();
  });

  it('should provide UserService', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .compile();

    const service = module.get<UserService>(UserService);
    expect(service).toBeInstanceOf(UserService);
  });

  it('should provide UserController', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .compile();

    const controller = module.get<UserController>(UserController);
    expect(controller).toBeInstanceOf(UserController);
  });

  it('should import EmailModule', async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, PrismaModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .overrideProvider(EmailService)
    .useValue(mockEmailService)
    .compile();

    expect(() => module.get(EmailModule)).not.toThrow();
  });
}); 