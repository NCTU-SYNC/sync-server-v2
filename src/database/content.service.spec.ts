import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { getModelToken } from '@nestjs/mongoose';
import { Content, ContentSchema } from './schemas/content.schema';
import * as mongoose from 'mongoose';

describe('ContentService', () => {
  let service: ContentService;
  let model: mongoose.Model<Content>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getModelToken(Content.name),
          useValue: mongoose.model(Content.name, ContentSchema),
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    model = module.get<mongoose.Model<Content>>(getModelToken(Content.name));
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
    it('should find one content by id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindById = jest.spyOn(model, 'findById');
      await service.findOneById(targetId);

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(targetId);
    });
  });

  describe('createOne', () => {
    it('should create one content', async () => {
      const mockContent: Content = {
        blockId: new mongoose.Types.ObjectId(1),
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockContent);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockContent);
    });
  });

  describe('updateOneById', () => {
    it('should update one content', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockContent: Content = {
        blockId: new mongoose.Types.ObjectId(1),
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockContent);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith({ _id: targetId }, mockContent);
    });
  });

  describe('deleteOneById', () => {
    it('should delete one content', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
