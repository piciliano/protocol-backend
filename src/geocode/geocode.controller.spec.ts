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
    const mockResponse = {
      data: [
        {
          lat: '-23.550520',
          lon: '-46.633308',
          display_name: 'Rua Teste, 123, São Paulo, SP',
        },
      ],
    };

    it('should return coordinates when address is provided', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await controller.getCoordinates(mockAddress);

      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mockAddress)}`,
        {
          headers: {
            'User-Agent': 'protocol-backend',
          },
        },
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mockAddress)}`,
        {
          headers: {
            'User-Agent': 'protocol-backend',
          },
        },
      );
    });
  });
}); 