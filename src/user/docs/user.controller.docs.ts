import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const ApiUserTag = () => ApiTags('👤 User');

export const ApiCreateUserDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Criar novo usuário',
      description: 'Cria um novo usuário no sistema',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou email já cadastrado',
    }),
  );

export const ApiFindAllUsersDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar todos os usuários',
      description: 'Retorna uma lista com todos os usuários cadastrados',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso',
    }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  );

export const ApiForgotPasswordDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Solicitar recuperação de senha',
      description: 'Envia um código de recuperação para o email do usuário',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'usuario@exemplo.com',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Código de recuperação enviado com sucesso',
    }),
    ApiResponse({ status: 404, description: 'Email não encontrado' }),
  );

export const ApiValidateCodeDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Validar código de recuperação',
      description: 'Valida o código enviado para o email do usuário',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: '123456',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Código validado com sucesso',
    }),
    ApiResponse({ status: 400, description: 'Código inválido ou expirado' }),
  );

export const ApiResetPasswordDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Redefinir senha',
      description:
        'Define uma nova senha para o usuário após validação do código',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          newPassword: {
            type: 'string',
            example: 'NovaSenha@123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Senha redefinida com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'Senha inválida ou sessão expirada',
    }),
  );

export const ApiFindUserByIdDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Buscar usuário por ID',
      description: 'Retorna os dados de um usuário específico',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do usuário',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário encontrado com sucesso',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
  );

export const ApiUpdateUserDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Atualizar usuário',
      description: 'Atualiza os dados de um usuário específico',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do usuário',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário atualizado com sucesso',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
  );

export const ApiUpdateRoleByEmailDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Atualizar papel do usuário por email',
      description:
        'Atualiza o papel de um usuário usando seu email (requer ADMIN)',
    }),
    ApiParam({
      name: 'email',
      description: 'Email do usuário',
      example: 'usuario@exemplo.com',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            enum: ['USER', 'ADMIN', 'MODERATOR'],
            example: 'MODERATOR',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Papel do usuário atualizado com sucesso',
    }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
  );

export const ApiRemoveUserDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Remover usuário',
      description: 'Remove um usuário do sistema (requer ADMIN)',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do usuário',
      example: '1',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuário removido com sucesso',
    }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
  );
