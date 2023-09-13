import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { ConversationNotFoundException } from './exceptions/conversation-not-found.exception';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async create(creator: User, createConversationDto: CreateConversationDto) {
    //? add group creator  (admin) to the conversation participants
    createConversationDto.participants.push(creator._id.toString());

    if (createConversationDto.participants.length < 2)
      throw new BadRequestException('participants must be at least 2');

    const conversation = await this.conversationModel.create(
      createConversationDto,
    );
    return await this.findOneById(conversation._id.toString());
  }

  findConversationForUser(user: User) {
    const conversations = this.conversationModel
      .find({
        participants: { $in: [user._id.toString()] },
      })
      .populate('participants');
    return conversations;
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

  async findOneById(id: string) {
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
