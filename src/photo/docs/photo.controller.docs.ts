import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

export const SwaggerTagsPhoto = () =>
  applyDecorators(ApiTags('📸 Photo'), ApiBearerAuth());

export const SwaggerCreatePhoto = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Upload de fotos',
      description: 'Realiza o upload de até 5 fotos para um protocolo',
    }),
    ApiConsumes('multipart/form-data'),
    ApiParam({
      name: 'id',
      description: 'ID do protocolo',
      example: '1',
    }),
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
            description: 'Arquivos de imagem (máximo 5)',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Fotos enviadas com sucesso',
    }),
    ApiResponse({
      status: 400,
      description: 'Nenhum arquivo enviado ou limite de fotos excedido',
    }),
    ApiResponse({
      status: 404,
      description: 'Protocolo não encontrado',
    }),
  );
