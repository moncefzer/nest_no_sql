import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class ConnectedUser {
  id?: Types.ObjectId;

  @Prop()
  socketId: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | string;
}

export const ConnectedUserSchema = SchemaFactory.createForClass(ConnectedUser);
