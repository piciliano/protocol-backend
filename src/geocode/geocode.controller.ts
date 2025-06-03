import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('geocode')
export class GeocodeController {
  @Get()
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
