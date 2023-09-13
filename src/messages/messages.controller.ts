import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { EmptyMessageException } from './exceptions/empty-message.exception';
import { User } from 'src/user/entities/user.entity';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, ServerEvents } from 'src/core/utils/constants';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller(Routes.MESSAGES)
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(
    private readonly messageService: MessagesService,
    private events: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @GetUser() user: User,
    @Param('id') conversationId: string,
    @Body()
    createMessageDto: CreateMessageDto,
  ) {
    if (!createMessageDto.content) throw new EmptyMessageException();
    const params = { user, conversationId, content: createMessageDto.content };
    const response = await this.messageService.create(params);
    this.events.emit(ServerEvents.MESSAGE_CREATE, response);
    return;
  }

  @Get()
  async getMessagesFromConversation(
    @GetUser() user: User,
    @Param('id') conversationId: string,
  ) {
    const messages = await this.messageService.findMessagesForRoom(
      conversationId,
    );
    return messages;
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @GetUser() user: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { userId: user._id, conversationId, messageId };
    // TODO: check if user is the owner of the message
    await this.messageService.delete(messageId);
    this.events.emit('message.delete', params);
    return { conversationId, messageId };
  }

  @Patch(':messageId')
  async editMessage(
    @GetUser() user: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() updatemessageDto: UpdateMessageDto,
  ) {
    const params = { user, messageId, updatemessageDto };
    const message = await this.messageService.update(params);
    this.events.emit('message.update', message);
    return message;
  }
}
