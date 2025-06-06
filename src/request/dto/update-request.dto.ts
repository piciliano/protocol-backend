import { PartialType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @ApiProperty({
    description: 'Status do protocolo',
    enum: RequestStatus,
    example: RequestStatus.EM_ANDAMENTO,
    required: false
  })
  status?: RequestStatus;
}
