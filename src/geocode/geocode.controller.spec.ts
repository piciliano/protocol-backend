import { Test, TestingModule } from '@nestjs/testing';
import { GeocodeController } from './geocode.controller';
import axios from 'axios';

jest.mock('axios');

describe('GeocodeController', () => {
  let controller: GeocodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeocodeController],
    }).compile();

    controller = module.get<GeocodeController>(GeocodeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoordinates', () => {
    const mockAddress = 'Rua Teste, 123';
    const mockApiKey = 'fake-api-key';

    const mockResponse = {
      data: {
        results: [
          {
            geometry: { lat: -23.55052, lng: -46.633308 },
            components: {
              road: 'Rua Teste',
              city: 'São Paulo',
              state: 'SP',
              country: 'Brasil',
            },
            formatted: 'Rua Teste, 123, São Paulo, SP, Brasil',
          },
        ],
      },
    };

    beforeAll(() => {
      process.env.API_KEY = mockApiKey;
    });

    it('should return coordinates when address is provided', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await controller.getCoordinates(mockAddress);

      expect(result).toEqual({
        lat: mockResponse.data.results[0].geometry.lat,
        lng: mockResponse.data.results[0].geometry.lng,
        components: mockResponse.data.results[0].components,
        formatted: mockResponse.data.results[0].formatted,
      });

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(mockAddress)}&key=${mockApiKey}&language=pt&countrycode=br&limit=1`,
      );
    });

    it('should return empty array when no address is provided', async () => {
      const result = await controller.getCoordinates('');

      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return empty array when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const result = await controller.getCoordinates(mockAddress);

      expect(result).toEqual([]);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(mockAddress)}&key=${mockApiKey}&language=pt&countrycode=br&limit=1`,
      );
    });

    it('should return empty array when API returns no results', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { results: [] } });

      const result = await controller.getCoordinates(mockAddress);

      expect(result).toEqual([]);
    });
  });
});
