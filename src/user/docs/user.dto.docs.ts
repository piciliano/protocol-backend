import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyName = () =>
  ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    required: true,
  });

export const ApiPropertyEmail = () =>
  ApiProperty({
    description: 'Email do usuário para acesso ao sistema',
    example: 'joao.silva@exemplo.com',
    required: true,
  });

export const ApiPropertyPassword = () =>
  ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
    required: true,
    minLength: 6,
  });
