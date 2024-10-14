import request from 'supertest';
import StoreService from '../services/stores.service';
import { faker } from '@faker-js/faker/.';
import app from '..';

// Mock the StoreService methods
jest.mock('../services/stores.service');

describe('Store API Endpoints', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('GET /stores/find-available', () => {
    it('should return available stores with matching preferences and table capacity', async () => {
      const mockStores = [{ _id: '1', name: faker.company.name() }];
      (StoreService.getAvailableStoresTables as jest.Mock).mockResolvedValue(mockStores);

      const response = await request(app)
        .get('/stores/find-available')
        .query({ preferences: ['preference1'], diners: 2, date: '2024-10-14T10:00:00Z' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStores);
      expect(StoreService.getAvailableStoresTables).toHaveBeenCalled();
    });

    it('should return 404 if no stores are found', async () => {
      (StoreService.getAvailableStoresTables as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/stores/find-available')
        .query({ preferences: ['preference1'], diners: 2, date: '2024-10-14T10:00:00Z' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No stores with matching preferences and table capacity' });
    });

    it('should return 500 if an error occurs', async () => {
      (StoreService.getAvailableStoresTables as jest.Mock).mockRejectedValue(new Error('Error finding stores'));

      const response = await request(app)
        .get('/stores/find-available')
        .query({ preferences: ['preference1'], diners: 2, date: '2024-10-14T10:00:00Z' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error finding stores' });
    });
  });


});