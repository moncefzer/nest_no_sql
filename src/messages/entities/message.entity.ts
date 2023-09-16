import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Populated } from 'src/core/utils/types';

@Schema({ timestamps: { createdAt: true } })
export class Message extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Conversation.name })
  conversation: Populated<Conversation>;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  sender: Populated<User>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
