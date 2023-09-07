import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JoinedRoom } from '../entities/joined-room.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectModel(JoinedRoom.name)
    private readonly joinedRoomModel: Model<JoinedRoom>,
  ) {}

  async create(joinedRoom: JoinedRoom): Promise<JoinedRoom> {
    const JoinedRoomExist = await this.joinedRoomModel.findOne({
      socketId: joinedRoom.socketId,
      room: joinedRoom.room,
    });

    if (JoinedRoomExist) return JoinedRoomExist;

    return this.joinedRoomModel.create(joinedRoom);
  }

  async findByUser(user: User): Promise<JoinedRoom[]> {
    return this.joinedRoomModel.find({ user });
  }

  async findByRoom(roomId: string): Promise<JoinedRoom[]> {
    return this.joinedRoomModel.find({ room: roomId });
  }

  async deletebySocketId(socketId: string) {
    return this.joinedRoomModel.deleteOne({ socketId });
  }

  async deleteAll() {
    await this.joinedRoomModel.deleteMany({});
  }
}
