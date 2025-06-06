import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Nova senha do usuário (opcional)',
    example: 'NovaSenha@123',
    required: false,
    minLength: 6
  })
  password?: string;
}
