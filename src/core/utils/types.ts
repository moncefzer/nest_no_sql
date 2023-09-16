import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { ObjectId, Document, PopulatedDoc } from 'mongoose';

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

export type Populated<T> = PopulatedDoc<Document<ObjectId> & T>;
