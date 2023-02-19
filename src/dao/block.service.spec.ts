import { Test, TestingModule } from '@nestjs/testing';
import { BlockService } from './block.service';
import { getModelToken } from '@nestjs/mongoose';
import { Block, BlockSchema } from '../schemas/block.schema';
import mongoose, { Model } from 'mongoose';

describe('BlockService', () => {
  let service: BlockService;
  let model: Model<Block>;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        {
          provide: getModelToken(Block.name),
          useValue: mongoose.model(Block.name, BlockSchema),
        },
      ],
    }).compile();

    service = module.get<BlockService>(BlockService);
    model = module.get<Model<Block>>(getModelToken(Block.name));
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
    it('should find one block by id', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyFindById = jest.spyOn(model, 'findById');
      await service.findOneById(targetId);

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyFindById).toHaveBeenCalledWith(targetId);
    });
  });

  describe('createOne', () => {
    it('should create one block', async () => {
      const mockBlock: Block = {
        blockId: new mongoose.Types.ObjectId(1),
        articleId: new mongoose.Types.ObjectId(1),
        authors: [],
      };

      const spyCreate = jest.spyOn(model, 'create');
      await service.createOne(mockBlock);

      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyCreate).toHaveBeenCalledWith(mockBlock);
    });
  });

  describe('updateOneById', () => {
    it('should update one block', async () => {
      const targetId = new mongoose.Types.ObjectId(1);
      const mockBlock: Block = {
        blockId: new mongoose.Types.ObjectId(1),
        articleId: new mongoose.Types.ObjectId(1),
        authors: [],
      };

      const spyUpdateOne = jest.spyOn(model, 'updateOne');
      await service.updateOneById(targetId, mockBlock);

      expect(spyUpdateOne).toHaveBeenCalledTimes(1);
      expect(spyUpdateOne).toHaveBeenCalledWith({ _id: targetId }, mockBlock);
    });
  });

  describe('deleteOneById', () => {
    it('should delete one block', async () => {
      const targetId = new mongoose.Types.ObjectId(1);

      const spyDeleteOne = jest.spyOn(model, 'deleteOne');
      await service.deleteOneById(targetId);

      expect(spyDeleteOne).toHaveBeenCalledTimes(1);
      expect(spyDeleteOne).toHaveBeenCalledWith({ _id: targetId });
    });
  });
});
