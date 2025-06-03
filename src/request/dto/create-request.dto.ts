import { RequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'Nome do protocolo',
    example: 'Manutenção de Calçada',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição detalhada do protocolo',
    example: 'Calçada danificada na frente do número 123, necessitando reparo urgente',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Estado',
    example: 'SP',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiProperty({
    description: 'Status do protocolo',
    enum: RequestStatus,
    example: RequestStatus.PENDENTE,
    default: RequestStatus.PENDENTE,
    required: false
  })
  @IsEnum(RequestStatus)
  status: RequestStatus = RequestStatus.PENDENTE;
}
