import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'create-delete-test@test.com',
  password: '111111',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const accessToken = body.access_token;
        expect(accessToken).toBeDefined();
        done();
      });
  });

  it('/auth/login (POST) - "login" failure', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'fail-login' })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - "week password" failure', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '13456' })
      .expect(400, {
        statusCode: 400,
        message: ['Input minimum 6  symbols'],
        error: 'Bad Request',
      });
  });

  it('/auth/login (POST) - "wrong password" failure', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '1345655' })
      .expect(401, {
        statusCode: 401,
        message: 'Wrong password',
        error: 'Unauthorized',
      });
  });

  afterAll(() => disconnect());
});
