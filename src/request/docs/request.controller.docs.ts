import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';

export const SwaggerTagsRequest = () =>
  applyDecorators(ApiTags('📝 Request'), ApiBearerAuth());

export const SwaggerCreateRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Criar uma nova solicitação' }),
    ApiResponse({ status: 201, description: 'Solicitação criada com sucesso' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiBody({ type: CreateRequestDto }),
  );

export const SwaggerCreateRequestWithPhoto = () =>
  applyDecorators(
    ApiOperation({ summary: 'Criar uma nova solicitação com fotos' }),
    ApiConsumes('multipart/form-data'),
    ApiResponse({
      status: 201,
      description: 'Solicitação com fotos criada com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou nenhuma foto enviada',
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );

export const SwaggerGetRequestsForUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obter todas as solicitações do usuário logado' }),
    ApiResponse({
      status: 200,
      description: 'Lista de solicitações retornada com sucesso',
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  );

export const SwaggerFindAllRequests = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar todas as solicitações' }),
    ApiResponse({
      status: 200,
      description: 'Lista de solicitações retornada com sucesso',
    }),
  );

export const SwaggerFindOneRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Buscar uma solicitação pelo ID' }),
    ApiParam({ name: 'id', description: 'ID da solicitação' }),
    ApiResponse({
      status: 200,
      description: 'Solicitação encontrada com sucesso',
    }),
    ApiResponse({ status: 404, description: 'Solicitação não encontrada' }),
  );

export const SwaggerUpdateRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualizar uma solicitação' }),
    ApiParam({ name: 'id', description: 'ID da solicitação' }),
    ApiBody({ type: UpdateRequestDto }),
    ApiResponse({
      status: 200,
      description: 'Solicitação atualizada com sucesso',
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 404, description: 'Solicitação não encontrada' }),
  );

export const SwaggerDeleteRequest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Remover uma solicitação' }),
    ApiParam({ name: 'id', description: 'ID da solicitação' }),
    ApiResponse({
      status: 200,
      description: 'Solicitação removida com sucesso',
    }),
    ApiResponse({ status: 404, description: 'Solicitação não encontrada' }),
  );
