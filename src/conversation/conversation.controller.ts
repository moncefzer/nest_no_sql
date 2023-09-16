import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../auth/decorator/user.decorator';
import { ConversationService } from './conversation.service';
import { Routes, ServerEvents } from '../core/utils/constants';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller(Routes.CONVERSATIONS)
@UseGuards(JwtGuard)
export class ConversationController {
  constructor(
    private readonly conversationsService: ConversationService,
    private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @GetUser() user: User,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.create(
      user,
      createConversationDto,
    );
    this.events.emit(ServerEvents.CONVERSATION_CREATE, conversation);
    return conversation;
  }

  @Get()
  async getConversations(@GetUser() user: User) {
    // todo : impl pagination
    return await this.conversationsService.findConversationForUser(user);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    return this.conversationsService.findOneById(id);
  }
}
