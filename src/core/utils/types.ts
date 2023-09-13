import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';

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
