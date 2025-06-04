import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  ApiPropertyEmail,
  ApiPropertyName,
  ApiPropertyPassword,
} from '../docs/user.dto.docs';

export class CreateUserDto {
  @ApiPropertyName()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyEmail()
  @IsEmail()
  email: string;

  @ApiPropertyPassword()
  @IsNotEmpty()
  @IsString()
  password: string;
}
