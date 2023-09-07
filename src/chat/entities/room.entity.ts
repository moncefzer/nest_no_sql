import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Room {
  _id?: Types.ObjectId;

  @Prop()
  roomName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  users: User[] | Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
