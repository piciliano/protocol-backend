import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/jwt-guard.role';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard) ---- guards
  // @Roles('USER') ---- permissões
  // @LoggedUSer() user: JwtPayload ---- decorator
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.userService.requestPasswordRecovery(email);
  }

  @Post('validate-code')
  async validateCode(@Body('code') code: string) {
    return await this.userService.validateRecoveryCode(code);
  }

  @Post('reset-password')
  async resetPassword(@Body('newPassword') newPassword: string) {
    return await this.userService.resetPassword(newPassword);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
