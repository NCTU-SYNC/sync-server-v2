import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getModelToken } from '@nestjs/mongoose';
import { News, NewsSchema } from '../schemas/news.schema';
import mongoose, { Model } from 'mongoose';

describe('NewsService', () => {
  let service: NewsService;
  let model: Model<News>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getModelToken(News.name),
          useValue: mongoose.model(News.name, NewsSchema),
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    model = module.get<Model<News>>(getModelToken(News.name));
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
    it('should find one news by id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindById = jest.spyOn(model, 'findById');
      await service.findOneById(targetId);

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(targetId);
    });
  });

  describe('createOne', () => {
    it('should create one news', async () => {
      const mockNews: News = {
        newsId: new mongoose.Types.ObjectId(1),
        title: 'test',
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockNews);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockNews);
    });
  });

  describe('updateOneById', () => {
    it('should update one news', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockNews: News = {
        newsId: new mongoose.Types.ObjectId(1),
        title: 'test',
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockNews);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith({ _id: targetId }, mockNews);
    });
  });

  describe('deleteOneById', () => {
    it('should delete one news', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
