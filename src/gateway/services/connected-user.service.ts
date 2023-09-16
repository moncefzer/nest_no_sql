import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IPaginationOptions } from 'src/core/interfaces/ipagination.option';
import { Pagination } from 'src/core/interfaces/pagination';
import { paginateModel } from 'src/core/utils/pagination-utils';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { ConnectedUser } from '../entities/connected-user.entity';
import { ConnectedUserDto } from '../dto/connected-user.dto';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectModel(ConnectedUser.name)
    private readonly connectedUserModel: Model<ConnectedUser>,
  ) {}

  async create(connectedUserDto: ConnectedUserDto) {
    const connection = await this.connectedUserModel.create(connectedUserDto);
    return connection;
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ConnectedUser>> {
    return paginateModel(this.connectedUserModel, options);
  }

  findAll() {
    const connectedUser = this.connectedUserModel.find({});
    return connectedUser;
  }

  async findOne(id: string) {
    try {
      const connection = await this.connectedUserModel.findById(id);
      if (!connection)
        throw new NotFoundException(`connection with id ${id} not found`);
      return connection;
    } catch (err) {
      throw new NotFoundException(`post with id ${id} not found`);
    }
  }

  async findByUser(userId: string): Promise<ConnectedUser> {
    const connection = await this.connectedUserModel.findOne({
      user: new Types.ObjectId(userId),
    });
    return connection;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.connectedUserModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
  }

  async deleteBySocketId(socketId: string) {
    await this.connectedUserModel.findOneAndDelete({
      socketId,
    });
  }

  async deleteAllConnetions() {
    return this.connectedUserModel.deleteMany({});
  }
}
