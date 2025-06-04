import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export const SwaggerTagsGeocode = () => applyDecorators(ApiTags('🌍 Geocode'));

export const SwaggerGetCoordinates = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Buscar coordenadas',
      description: 'Retorna as coordenadas geográficas de um endereço',
    }),
    ApiQuery({
      name: 'q',
      description: 'Endereço para buscar coordenadas',
      example: 'Avenida Paulista, São Paulo',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Coordenadas encontradas com sucesso',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            lat: {
              type: 'string',
              example: '-23.5505',
            },
            lon: {
              type: 'string',
              example: '-46.6333',
            },
            display_name: {
              type: 'string',
              example: 'Avenida Paulista, São Paulo - SP, Brasil',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Nenhuma coordenada encontrada',
      schema: {
        type: 'array',
        items: {},
        example: [],
      },
    }),
  );
