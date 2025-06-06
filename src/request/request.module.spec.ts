import { Test } from '@nestjs/testing';
import { RequestModule } from './request.module';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PhotoModule } from 'src/photo/photo.module';
import { PrismaModule } from 'prisma/prisma.module';

describe('RequestModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [RequestModule, PhotoModule, PrismaModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide RequestService', async () => {
    const module = await Test.createTestingModule({
      imports: [RequestModule, PhotoModule, PrismaModule],
    }).compile();

    const service = module.get<RequestService>(RequestService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(RequestService);
  });

  it('should provide RequestController', async () => {
    const module = await Test.createTestingModule({
      imports: [RequestModule, PhotoModule, PrismaModule],
    }).compile();

    const controller = module.get<RequestController>(RequestController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(RequestController);
  });
}); 