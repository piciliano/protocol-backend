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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';

@ApiTags('👤 User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos ou email já cadastrado' 
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista com todos os usuários cadastrados'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso'
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findAll() {
    return this.userService.findAll();
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description: 'Envia um código de recuperação para o email do usuário'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'usuario@exemplo.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Código de recuperação enviado com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Email não encontrado' })
  async forgotPassword(@Body('email') email: string) {
    return await this.userService.requestPasswordRecovery(email);
  }

  @Post('validate-code')
  @ApiOperation({
    summary: 'Validar código de recuperação',
    description: 'Valida o código enviado para o email do usuário'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: '123456'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Código validado com sucesso'
  })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async validateCode(@Body('code') code: string) {
    return await this.userService.validateRecoveryCode(code);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Redefinir senha',
    description: 'Define uma nova senha para o usuário após validação do código'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: {
          type: 'string',
          example: 'NovaSenha@123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso'
  })
  @ApiResponse({ status: 400, description: 'Senha inválida ou sessão expirada' })
  async resetPassword(@Body('newPassword') newPassword: string) {
    return await this.userService.resetPassword(newPassword);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário específico'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso'
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('by-email/:email')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Atualizar papel do usuário por email',
    description: 'Atualiza o papel de um usuário usando seu email (requer ADMIN)'
  })
  @ApiParam({
    name: 'email',
    description: 'Email do usuário',
    example: 'usuario@exemplo.com'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['USER', 'ADMIN', 'MODERATOR'],
          example: 'MODERATOR'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Papel do usuário atualizado com sucesso'
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  updateRoleByEmail(@Param('email') email: string, @Body('role') role: Role) {
    return this.userService.updateRoleByEmail(email, role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário do sistema (requer ADMIN)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso'
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
