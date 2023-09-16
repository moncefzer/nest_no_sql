import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { ConversationNotFoundException } from './exceptions/conversation-not-found.exception';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @Inject(forwardRef(() => MessagesService))
    private readonly messageService: MessagesService,
  ) {}

  async create(creator: User, createConversationDto: CreateConversationDto) {
    //? add group creator  (admin) to the conversation participants
    createConversationDto.participants.push(creator.id);

    if (createConversationDto.participants.length < 2)
      throw new BadRequestException('participants must be at least 2');

    const conversation = await this.conversationModel.create(
      createConversationDto,
    );

    //? will handle update last message sent in conversation
    await this.messageService.create({
      content: createConversationDto.message,
      conversationId: conversation.id,
      user: creator,
    });

    return await this.findOneById(conversation.id);
  }

  async findConversationForUser(user: User): Promise<Conversation[]> {
    const conversations = await this.conversationModel
      .find({
        participants: { $in: [user.id] },
      })
      .populate('participants');

    return conversations;
  }

  async updateLastMessageSent(
    conversationId: string,
    lastMessage: Message,
  ): Promise<Conversation> {
    return this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          lastMessageSent: lastMessage,
        },
        { new: true },
      )
      .populate('participants');
  }

  async checkIfConversationExists(conversationId: string) {
    try {
      const conversation = await this.conversationModel.findById(
        conversationId,
      );
      if (!conversation) throw new ConversationNotFoundException();
      return conversation;
    } catch (err) {
      throw new ConversationNotFoundException();
    }
  }

  async findOneById(id: string): Promise<Conversation> {
    try {
      const room = await this.conversationModel
        .findById(id)
        .populate('participants');

      if (!room) throw new ConversationNotFoundException();
      return room;
    } catch (err) {
      throw new ConversationNotFoundException();
    }
  }

  // update({ id, lastMessageSent }: UpdateConversationParams) {
  //   return this.conversationModel.update(id, { lastMessageSent });
  // }
}
