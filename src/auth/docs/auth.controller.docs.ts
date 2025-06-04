import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from '../dto/login-user.dto';

export const SwaggerTagsAuth = () => applyDecorators(ApiTags('🔐 Auth'));

export const SwaggerLogin = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Realizar login',
      description: 'Autentica um usuário e retorna um token JWT',
    }),
    ApiBody({ type: LoginUserDto }),
    ApiResponse({
      status: 200,
      description: 'Login realizado com sucesso',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Credenciais inválidas' }),
  );
