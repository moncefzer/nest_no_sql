import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Populated } from 'src/core/utils/types';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class JoinedConversation extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Populated<User>;

  @Prop({ type: Types.ObjectId, ref: Conversation.name })
  conversation: Populated<Conversation>;

  @Prop()
  socketId: string;
}

export const JoinedConversationSchema =
  SchemaFactory.createForClass(JoinedConversation);
