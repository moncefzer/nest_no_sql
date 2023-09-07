import { Types } from 'mongoose';
import { Room } from './room.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: { createdAt: true } })
export class Message {
  _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Room.name })
  room: Room | string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  sender: User | string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
