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
import { Role } from '@prisma/client';

import {
  ApiUserTag,
  ApiCreateUserDoc,
  ApiFindAllUsersDoc,
  ApiForgotPasswordDoc,
  ApiValidateCodeDoc,
  ApiResetPasswordDoc,
  ApiFindUserByIdDoc,
  ApiUpdateUserDoc,
  ApiUpdateRoleByEmailDoc,
  ApiRemoveUserDoc,
} from './docs/user.controller.docs';

@ApiUserTag()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreateUserDoc()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get()
  @ApiFindAllUsersDoc()
  findAll() {
    return this.userService.findAll();
  }

  @Post('forgot-password')
  @ApiForgotPasswordDoc()
  async forgotPassword(@Body('email') email: string) {
    return await this.userService.requestPasswordRecovery(email);
  }

  @Post('validate-code')
  @ApiValidateCodeDoc()
  async validateCode(@Body('code') code: string) {
    return await this.userService.validateRecoveryCode(code);
  }

  @Post('reset-password')
  @ApiResetPasswordDoc()
  async resetPassword(@Body('newPassword') newPassword: string) {
    return await this.userService.resetPassword(newPassword);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiFindUserByIdDoc()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateUserDoc()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('by-email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiUpdateRoleByEmailDoc()
  updateRoleByEmail(@Param('email') email: string, @Body('role') role: Role) {
    return this.userService.updateRoleByEmail(email, role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiRemoveUserDoc()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
