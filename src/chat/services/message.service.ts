import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaginationOptions } from 'src/core/interfaces/ipagination.option';
import { Pagination } from 'src/core/interfaces/pagination';
import { paginateModel } from 'src/core/utils/pagination-utils';
import { User } from 'src/user/entities/user.entity';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Room } from '../entities/room.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async create(user: User, createMessageDto: CreateMessageDto) {
    const createdmessage = await this.messageModel.create({
      message: createMessageDto.message,
      room: createMessageDto.roomId,
      sender: user,
    });

    return createdmessage;
  }

  async paginateMessagesForRoom(
    room: Room,
    options: IPaginationOptions,
  ): Promise<Pagination<Message>> {
    return paginateModel(this.messageModel, options);
  }

  findMessagesForRoom(roomId: string): Promise<Message[]> {
    const messages = this.messageModel.find({ room: roomId }, null, {
      sort: { createdAt: -1 },
    });
    return messages;
  }

  async findOne(id: string) {
    try {
      const message = await this.messageModel.findById(id);
      if (!message)
        throw new NotFoundException(`message with id ${id} not found`);
      return message;
    } catch (err) {
      throw new NotFoundException(`message with id ${id} not found`);
    }
  }

  // async update(id: string, updatemessageDto: UpdateMessageDto) {
  //   await this.findOne(id);
  //   return this.messageModel.findByIdAndUpdate(id, updatemessageDto, {
  //     new: true,
  //   });
  // }

  // async remove(id: string) {
  //   const foundmessage = await this.findOne(id);
  //   return foundmessage.deleteOne();
  // }
}
