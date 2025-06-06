import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('AuthModule', () => {
  beforeEach(() => {
    process.env.SECRET_OR_KEY = 'test-secret';
    process.env.EXPIRES_IN = '1h';
  });

  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            SECRET_OR_KEY: process.env.SECRET_OR_KEY,
            EXPIRES_IN: process.env.EXPIRES_IN,
          })],
        }),
        AuthModule,
        PrismaModule,
      ],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide AuthService', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            SECRET_OR_KEY: process.env.SECRET_OR_KEY,
            EXPIRES_IN: process.env.EXPIRES_IN,
          })],
        }),
        AuthModule,
        PrismaModule,
      ],
    }).compile();

    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should provide AuthController', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            SECRET_OR_KEY: process.env.SECRET_OR_KEY,
            EXPIRES_IN: process.env.EXPIRES_IN,
          })],
        }),
        AuthModule,
        PrismaModule,
      ],
    }).compile();

    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AuthController);
  });

  it('should provide JwtStrategy', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            SECRET_OR_KEY: process.env.SECRET_OR_KEY,
            EXPIRES_IN: process.env.EXPIRES_IN,
          })],
        }),
        AuthModule,
        PrismaModule,
      ],
    }).compile();

    const strategy = module.get<JwtStrategy>(JwtStrategy);
    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });
}); 