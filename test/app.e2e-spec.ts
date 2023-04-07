import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import * as request from 'supertest';

@Module({})
class FakeMongooseModule {}

jest.mock('@nestjs/mongoose', () => ({
  MongooseModule: {
    forRootAsync: jest.fn(() => FakeMongooseModule),
  },
}));

import { AppModule } from './../src/app.module';

interface ResponseBody {
  statusCode: number;
  message: string;
  error?: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    const expecedBody: ResponseBody = {
      statusCode: 404,
      message: 'Cannot GET /',
      error: 'Not Found',
    };

    return request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect(expecedBody);
  });
});
