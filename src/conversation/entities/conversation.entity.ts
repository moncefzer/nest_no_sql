import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Conversation {
  _id?: string;

  @Prop()
  conversationName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  participants: User[] | string[];

  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
