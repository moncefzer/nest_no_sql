import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Populated } from '../../core/utils/types';
import { User } from '../../user/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop()
  conversationName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  participants: Populated<User>[];

  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessageSent: Populated<Message>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
