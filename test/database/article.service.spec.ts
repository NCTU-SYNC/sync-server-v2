import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../../src/database/article.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  Article,
  ArticleSchema,
} from '../../src/database/schemas/article.schema';
import * as mongoose from 'mongoose';

describe('ArticleService', () => {
  let service: ArticleService;
  let model: mongoose.Model<Article>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: mongoose.model(Article.name, ArticleSchema),
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    model = module.get<mongoose.Model<Article>>(getModelToken(Article.name));
  });

  afterEach(async () => {
    await model.deleteMany({});
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all articles with default limit', async () => {
      const defaultLimit = 30;

      const spyFind = jest.spyOn(model, 'find');
      await service.findAll();

      expect(spyFind).toHaveBeenCalledTimes(1);
      expect((spyFind.mock.calls as object[][])[0][2]).toEqual({
        limit: defaultLimit,
      });
    });

    it('should find all articles with options', async () => {
      const options = { limit: 10, sort: { _id: -1 } };

      const spyFind = jest.spyOn(model, 'find');
      await service.findAll(null, options);

      expect(spyFind).toHaveBeenCalledTimes(1);
      expect((spyFind.mock.calls as object[][])[0][2]).toEqual(options);
    });

    it('should find all articles with filter', async () => {
      const filter = { title: { $regex: 'test' } };

      const spyFind = jest.spyOn(model, 'find');
      await service.findAll(filter);

      expect(spyFind).toHaveBeenCalledTimes(1);
      expect(spyFind.mock.calls[0][0]).toEqual(filter);
    });

    it('should pass empty object if filter is nullish', async () => {
      const spyFind = jest.spyOn(model, 'find');

      await service.findAll();
      await service.findAll(null);
      await service.findAll(undefined);

      expect(spyFind).toHaveBeenCalledTimes(3);
      expect(spyFind.mock.calls[0][0]).toEqual({});
      expect(spyFind.mock.calls[1][0]).toEqual({});
      expect(spyFind.mock.calls[2][0]).toEqual({});
    });
  });

  describe('findOneById', () => {
    it('should find one article by id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindById = jest.spyOn(model, 'findById');
      await service.findOneById(targetId);

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(targetId);
    });
  });

  describe('createOne', () => {
    it('should create one article', async () => {
      const mockArticle = {
        title: 'test',
        authors: [],
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockArticle);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockArticle);
    });
  });

  describe('updateOneById', () => {
    it('should update one article', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockArticle = {
        title: 'test',
        authors: [],
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockArticle);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith({ _id: targetId }, mockArticle);
    });
  });

  describe('deleteOneById', () => {
    it('should delete one article', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
