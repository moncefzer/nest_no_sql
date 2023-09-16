import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Populated } from 'src/core/utils/types';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop()
  conversationName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  participants: User[];

  @Prop({})
  createdAt: Date;

  @Prop({})
  testUser: Populated<User>;

  @Prop({})
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
