import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import {
  SwaggerTagsGeocode,
  SwaggerGetCoordinates,
} from './docs/geocode.controller.docs';

@SwaggerTagsGeocode()
@Controller('geocode')
export class GeocodeController {
  @Get()
  @SwaggerGetCoordinates()
  async getCoordinates(@Query('q') address: string) {
    console.log('Recebido no backend o endereço:', address);

    if (!address) {
      console.log('Nenhum endereço fornecido, retornando array vazio.');
      return [];
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    console.log('URL formada para consulta:', url);

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'protocol-backend',
        },
      });

      console.log('Resposta recebida do Nominatim:');
      console.log('Status da resposta:', response.status);
      console.log('Dados retornados:', response.data);

      if (!response.data || response.data.length === 0) {
        console.log('Resposta vazia recebida do Nominatim.');
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar coordenadas no Nominatim:', error.message);

      if (error.response) {
        console.error('Status do erro:', error.response.status);
        console.error('Dados do erro:', error.response.data);
      } else {
        console.error('Erro sem resposta HTTP:', error);
      }

      return [];
    }
  }
}
