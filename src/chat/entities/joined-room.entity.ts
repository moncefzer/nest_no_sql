import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Room } from './room.entity';

@Schema()
export class JoinedRoom {
  _Id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | string;

  @Prop({ type: Types.ObjectId, ref: Room.name })
  room: Room | string;

  @Prop()
  socketId: string;
}

export const JoinedRoomSchema = SchemaFactory.createForClass(JoinedRoom);
