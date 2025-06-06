import { RequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  ApiPropertyName,
  ApiPropertyDescription,
  ApiPropertyStreet,
  ApiPropertyNeighborhood,
  ApiPropertyCity,
  ApiPropertyState,
  ApiPropertyZipcode,
  ApiPropertyStatus,
} from '../docs/request.dto.docs';

export class CreateRequestDto {
  @ApiPropertyName()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyDescription()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyStreet()
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiPropertyNeighborhood()
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiPropertyCity()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiPropertyState()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiPropertyZipcode()
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiPropertyStatus(RequestStatus)
  @IsEnum(RequestStatus)
  status: RequestStatus = RequestStatus.PENDENTE;
}
