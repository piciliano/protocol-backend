import { Test, TestingModule } from '@nestjs/testing';
import { PhotoModule } from './photo.module';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { PrismaModule } from 'prisma/prisma.module';

describe('PhotoModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PhotoModule, PrismaModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide PhotoController', () => {
    const controller = module.get<PhotoController>(PhotoController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(PhotoController);
  });

  it('should provide PhotoService', () => {
    const service = module.get<PhotoService>(PhotoService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PhotoService);
  });
}); 