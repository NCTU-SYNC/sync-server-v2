import { Test, TestingModule } from '@nestjs/testing';
import { LatestNewsService } from '../../src/database/latest_news.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  LatestNews,
  LatestNewsSchema,
} from '../../src/database/schemas/latest_news.schema';
import * as mongoose from 'mongoose';

describe('LatestNewsService', () => {
  let service: LatestNewsService;
  let model: mongoose.Model<LatestNews>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LatestNewsService,
        {
          provide: getModelToken(LatestNews.name),
          useValue: mongoose.model(LatestNews.name, LatestNewsSchema),
        },
      ],
    }).compile();

    service = module.get<LatestNewsService>(LatestNewsService);
    model = module.get<mongoose.Model<LatestNews>>(
      getModelToken(LatestNews.name),
    );
  });

  afterEach(async () => {
    await model.deleteMany({});
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('findOneById', () => {
    it('should find one latest_news by id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindById = jest.spyOn(model, 'findById');
      await service.findOneById(targetId);

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(targetId);
    });
  });

  describe('createOne', () => {
    it('should create one latest_news', async () => {
      const mockLatestNews: LatestNews = {
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockLatestNews);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockLatestNews);
    });
  });

  describe('updateOneById', () => {
    it('should update one latest_news', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockLatestNews: LatestNews = {
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockLatestNews);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith(
        { _id: targetId },
        mockLatestNews,
      );
    });
  });

  describe('deleteOneById', () => {
    it('should delete one latest_news', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
