import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseService } from '../database/mongoDB/database.service';

describe('UsersController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany();
  });

  describe('getUsers', () => {
    it('should return 200', async () => {
      const response = await request(httpServer).get('/api/user/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if no user found', async () => {
      const userId = 110;
      const response = await request(httpServer).get(`/api/user/${userId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('create user', () => {
    it('shold return used created with id', async () => {
      const user = {
        first_name: 'Allysson',
        email: 'allall@exemple.com',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      const response = await request(httpServer).post('/api/users').send(user);

      expect(response.status).toBe(400);
    });

    it('shold return 201, badformation', async () => {
      const user = {
        first_name: 'Allysson',
        last_name: 'Freitas',
        email: 'allall@exemple.com',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      const response = await request(httpServer).post('/api/users').send(user);
      expect(response.status).toBe(201);
    });
  });
  describe('Delite avatar', () => {
    it('shold return 200', async () => {
      const user = {
        imageId: '1',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      await dbConnection.collection('images').insertOne(user);
      const response = await request(httpServer).delete('/api/user/1/avatar');

      expect(response.status).toBe(200);
    });
  });
  describe('download avatar', () => {
    it('shold return 201', async () => {
      const response = await request(httpServer).get('/api/user/1/avatar');

      expect(response.status).toBe(200);
    });
  });
});
