import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyEmail = () =>
  ApiProperty({
    description: 'Email do usuário para login',
    example: 'usuario@exemplo.com',
    required: true,
  });

export const ApiPropertyPassword = () =>
  ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
    required: true,
    minLength: 6,
  });
