import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { JoinedConversation } from '../entities';
import { CreateJoinConvParams } from 'src/core/utils/types';

@Injectable()
export class JoinedConversationService {
  constructor(
    @InjectModel(JoinedConversation.name)
    private readonly joinedRoomModel: Model<JoinedConversation>,
  ) {}

  async create(params: CreateJoinConvParams): Promise<JoinedConversation> {
    const joinedRoomExist = await this.joinedRoomModel.findOne({
      socketId: params.socketId,
      conversation: params.conversation,
    });

    if (joinedRoomExist) return joinedRoomExist;

    return this.joinedRoomModel.create(params);
  }

  async findByUser(user: User): Promise<JoinedConversation[]> {
    return this.joinedRoomModel.find({ user });
  }

  async findByConversation(
    conversationId: string,
  ): Promise<JoinedConversation[]> {
    return this.joinedRoomModel.find({ conversation: conversationId });
  }

  async deletebySocketId(socketId: string) {
    return this.joinedRoomModel.deleteOne({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomModel.deleteMany({});
  }
}
