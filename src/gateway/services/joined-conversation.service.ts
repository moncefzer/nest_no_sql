import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { JoinedConversation } from '../entities';

@Injectable()
export class JoinedConversationService {
  constructor(
    @InjectModel(JoinedConversation.name)
    private readonly joinedRoomModel: Model<JoinedConversation>,
  ) {}

  async create(joinedRoom: JoinedConversation): Promise<JoinedConversation> {
    const JoinedRoomExist = await this.joinedRoomModel.findOne({
      socketId: joinedRoom.socketId,
      conversation: joinedRoom.conversation,
    });

    if (JoinedRoomExist) return JoinedRoomExist;

    return this.joinedRoomModel.create(joinedRoom);
  }

  async findByUser(user: User): Promise<JoinedConversation[]> {
    return this.joinedRoomModel.find({ user });
  }

  async findByRoom(roomId: string): Promise<JoinedConversation[]> {
    return this.joinedRoomModel.find({ room: roomId });
  }

  async deletebySocketId(socketId: string) {
    return this.joinedRoomModel.deleteOne({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomModel.deleteMany({});
  }
}
