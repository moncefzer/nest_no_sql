import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class JoinedConversation {
  _Id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | string;

  @Prop({ type: Types.ObjectId, ref: Conversation.name })
  conversation: Conversation | string;

  @Prop()
  socketId: string;
}

export const JoinedConversationSchema =
  SchemaFactory.createForClass(JoinedConversation);
