import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Block, BlockDocument } from './schemas/block.schema';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name)
    private readonly blockModel: Model<BlockDocument>,
  ) {}

  async findOneById(id: Types.ObjectId): Promise<Block> {
    return this.blockModel.findById(id).exec();
  }

  async createOne(block: Block): Promise<Block> {
    return this.blockModel.create(block);
  }

  async updateOneById(id: Types.ObjectId, partialBlock: Partial<Block>) {
    return this.blockModel.updateOne({ _id: id }, partialBlock).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.blockModel.deleteOne({ _id: id }).exec();
  }
}
