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

    const apiKey = process.env.API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=pt&countrycode=br&limit=1`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      if (!result) return [];

      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        components: result.components,
        formatted: result.formatted,
      };
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error.message);
      return [];
    }
  }
}
