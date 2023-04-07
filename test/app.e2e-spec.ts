import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';

@Module({})
class FakeMongooseModule {}

jest.mock('@nestjs/mongoose', () => ({
  MongooseModule: {
    forRootAsync: jest.fn(() => FakeMongooseModule),
  },
}));

import { AppModule } from './../src/app.module';

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
});
