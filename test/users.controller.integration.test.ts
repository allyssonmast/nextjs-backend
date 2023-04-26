import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/shared/database/mongoDB/database.service';

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

  describe('GET /api/user/$id', () => {
    it('should return 200 if user exist', async () => {
      const response = await request(httpServer).get('/api/user/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if no user found', async () => {
      const userId = 110;
      const response = await request(httpServer).get(`/api/user/${userId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users/', () => {
    it('shold return used created with id', async () => {
      const user = {
        first_name: 'Allysson',
        email: 'allall@exemple.com',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      const response = await request(httpServer).post('/api/users').send(user);

      expect(response.status).toBe(400);
    });

    it('should return an error if not include password in the response', async () => {
      const user = {
        first_name: 'Allysson',
        last_name: 'Freitas',
        email: 'allall@exemple.com',
        password: '123456',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      const response = await request(httpServer).post('/api/users').send(user);
      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('password');
    });
    it('should return an error if any required field is missing', async () => {
      const user = {
        last_name: 'Freitas',
        email: 'allall@exemple.com',
        password: '123456',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      const response = await request(httpServer).post('/api/users').send(user);
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Bad Request');
    });
  });
  describe('DELETE /api/user/$id/avatar', () => {
    it('shold return 200', async () => {
      const user = {
        imageId: '1',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      dbConnection.collection('Avatar').insertOne(user);
      const response = await request(httpServer).delete('/api/user/1/avatar');
      expect(response.status).toBe(200);
    });
    it('should return 404 if user not found', async () => {
      const response = await request(httpServer).delete(
        '/api/user/1000/avatar'
      );
      expect(response.status).toBe(404);
    });
  });
  describe('GET /api/user/$id/avatar', () => {
    it('should download and save the user avatar', async () => {
      const response = await request(httpServer).get('/api/user/1/avatar');
      expect(response.status).toBe(200);
    });
    it('should return 409 if user alredy exist', async () => {
      const avatar = {
        imageId: '1',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      };
      dbConnection.collection('Avatar').insertOne(avatar);
      const response = await request(httpServer).get('/api/user/1/avatar');
      expect(response.status).toBe(409);
    });
  });
});
