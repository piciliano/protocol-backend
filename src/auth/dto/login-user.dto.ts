import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email do usuário para login',
    example: 'usuario@exemplo.com',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
    required: true,
    minLength: 6
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
