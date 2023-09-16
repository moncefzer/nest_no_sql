import { Message } from 'src/messages/entities/message.entity';
import { UpdateMessageDto } from '../../messages/dto/update-message.dto';
import { User } from '../../user/entities/user.entity';
import { ObjectId, Document, PopulatedDoc } from 'mongoose';
import { Conversation } from 'src/conversation/entities/conversation.entity';

export type EditMessageParams = {
  user: User;
  messageId: string;
  updatemessageDto: UpdateMessageDto;
};

export type CreateMessageParams = {
  user: User;
  conversationId: string;
  content: string;
};
export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type CreateJoinConvParams = {
  socketId: string;
  conversation: string;
  user: string;
};

export type CreateMessageEventPayload = {
  message: Message;
  conversation: Conversation;
};

export type Populated<T extends Document> = PopulatedDoc<
  Document<ObjectId> & T
>;
