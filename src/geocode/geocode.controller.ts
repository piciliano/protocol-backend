import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('🌍 Geocode')
@Controller('geocode')
export class GeocodeController {
  @Get()
  @ApiOperation({
    summary: 'Buscar coordenadas',
    description: 'Retorna as coordenadas geográficas de um endereço'
  })
  @ApiQuery({
    name: 'q',
    description: 'Endereço para buscar coordenadas',
    example: 'Avenida Paulista, São Paulo',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Coordenadas encontradas com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          lat: {
            type: 'string',
            example: '-23.5505'
          },
          lon: {
            type: 'string',
            example: '-46.6333'
          },
          display_name: {
            type: 'string',
            example: 'Avenida Paulista, São Paulo - SP, Brasil'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Nenhuma coordenada encontrada',
    schema: {
      type: 'array',
      items: {},
      example: []
    }
  })
  async getCoordinates(@Query('q') address: string) {
    if (!address) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'protocol-backend',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error.message);
      return [];
    }
  }
}
