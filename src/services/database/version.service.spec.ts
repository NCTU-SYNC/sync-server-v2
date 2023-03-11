import { Test, TestingModule } from '@nestjs/testing';
import { VersionService } from './version.service';
import { getModelToken } from '@nestjs/mongoose';
import { Version, VersionSchema } from '../../schemas/version.schema';
import * as mongoose from 'mongoose';

describe('VersionService', () => {
  let service: VersionService;
  let model: mongoose.Model<Version>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionService,
        {
          provide: getModelToken(Version.name),
          useValue: mongoose.model(Version.name, VersionSchema),
        },
      ],
    }).compile();

    service = module.get<VersionService>(VersionService);
    model = module.get<mongoose.Model<Version>>(getModelToken(Version.name));
  });

  afterEach(async () => {
    await model.deleteMany({});
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('findOneByArticleId', () => {
    it('should find one version by article id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindOne = jest.spyOn(model, 'findOne');
      await service.findOneByArticleId(targetId);

      expect(spyFindOne).toHaveBeenCalledTimes(1);
      expect(spyFindOne).toHaveBeenCalledWith({ articleId: targetId });
    });
  });

  describe('createOne', () => {
    it('should create one version', async () => {
      const mockVersion: Version = {
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockVersion);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockVersion);
    });
  });

  describe('updateOneById', () => {
    it('should update one version', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockVersion: Version = {
        articleId: new mongoose.Types.ObjectId(1),
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockVersion);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith({ _id: targetId }, mockVersion);
    });
  });

  describe('deleteOneById', () => {
    it('should delete one version', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
