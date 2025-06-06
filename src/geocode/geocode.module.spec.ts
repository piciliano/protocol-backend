import { Test, TestingModule } from '@nestjs/testing';
import { GeocodeModule } from './geocode.module';
import { GeocodeController } from './geocode.controller';

describe('GeocodeModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [GeocodeModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide GeocodeController', () => {
    const controller = module.get<GeocodeController>(GeocodeController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(GeocodeController);
  });
}); 