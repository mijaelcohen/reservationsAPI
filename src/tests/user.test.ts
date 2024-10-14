import request from 'supertest';
import { Users } from '../models/user.schema';
import { faker } from '@faker-js/faker/.';
import app from '..';

jest.mock('../models/user.schema');

describe('User API', () => {
  
  const mockUsers = [
    { _id: '1', name: faker.person.fullName(), preferences: [] },
    { _id: '2', name: faker.person.fullName(), preferences: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all users', async () => {
    
    (Users.find as jest.Mock).mockResolvedValue(mockUsers);

    const res = await request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a new user', async () => {
    const newUser = { name: faker.person.fullName(), preferences:[] };

    (Users.create as jest.Mock).mockResolvedValue({ _id: '3', ...newUser });
    
    await request(app)
      .post('/users')
      .send(newUser)
      .expect(200);
  });
});
