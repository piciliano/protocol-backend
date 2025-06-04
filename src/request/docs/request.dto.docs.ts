import { ApiProperty } from '@nestjs/swagger';

export const ApiPropertyName = () =>
  ApiProperty({
    description: 'Nome do protocolo',
    example: 'Manutenção de Calçada',
    required: true,
  });

export const ApiPropertyDescription = () =>
  ApiProperty({
    description: 'Descrição detalhada do protocolo',
    example:
      'Calçada danificada na frente do número 123, necessitando reparo urgente',
    required: true,
  });

export const ApiPropertyStreet = () =>
  ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
    required: true,
  });

export const ApiPropertyNeighborhood = () =>
  ApiProperty({
    description: 'Bairro',
    example: 'Centro',
    required: true,
  });

export const ApiPropertyCity = () =>
  ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
    required: true,
  });

export const ApiPropertyState = () =>
  ApiProperty({
    description: 'Estado',
    example: 'SP',
    required: true,
  });

export const ApiPropertyZipcode = () =>
  ApiProperty({
    description: 'CEP',
    example: '01234-567',
    required: true,
  });

export const ApiPropertyStatus = (enumType: object) =>
  ApiProperty({
    description: 'Status do protocolo',
    enum: enumType,
    example: enumType['PENDENTE'],
    default: enumType['PENDENTE'],
    required: false,
  });
