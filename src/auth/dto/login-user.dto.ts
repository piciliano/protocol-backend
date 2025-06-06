import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyEmail, ApiPropertyPassword } from '../docs/auth.dto.docs';

export class LoginUserDto {
  @ApiPropertyEmail()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyPassword()
  @IsNotEmpty()
  @IsString()
  password: string;
}
