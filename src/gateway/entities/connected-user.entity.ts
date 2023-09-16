import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Populated } from 'src/core/utils/types';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class ConnectedUser extends mongoose.Document {
  @Prop()
  socketId: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Populated<User>;
}

export const ConnectedUserSchema = SchemaFactory.createForClass(ConnectedUser);
