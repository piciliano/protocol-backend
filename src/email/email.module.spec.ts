import { Test, TestingModule } from '@nestjs/testing';
import { EmailModule } from './email.module';
import { EmailService } from './email.service';

describe('EmailModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide EmailService', () => {
    const service = module.get<EmailService>(EmailService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EmailService);
  });
}); 