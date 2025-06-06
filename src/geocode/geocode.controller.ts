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
    if (!address) return [];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'protocol-backend',
        },
      });

        console.log('URL chamada no Nominatim:', url);
      console.log('Status da resposta:', response.status);
      console.log('Dados retornados:', response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error.message);
      return [];
    }
  }
}
