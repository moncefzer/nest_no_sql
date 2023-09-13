import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaginationOptions } from 'src/core/interfaces/ipagination.option';
import { Pagination } from 'src/core/interfaces/pagination';
import { paginateModel } from 'src/core/utils/pagination-utils';
import { Message } from './entities/message.entity';
import { MessageNotFoundException } from './exceptions/message-not-found.exception';
import { CannotEditMessageException } from './exceptions/cannot-edit-message.exception';
import { CreateMessageParams, EditMessageParams } from 'src/core/utils/types';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly conversatonsService: ConversationService,
  ) {}

  async create(params: CreateMessageParams) {
    await this.conversatonsService.checkIfConversationExists(
      params.conversationId,
    );

    const createdmessage = await this.messageModel.create({
      content: params.content,
      conversation: params.conversationId,
      sender: params.user,
    });

    //todo : update lastSendMessage in the conversation
    const conversation = await this.conversatonsService.findOneById(
      createdmessage.conversation as string,
    );

    return { message: createdmessage, conversation };
  }

  async paginateMessagesForRoom(
    conversationId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Message>> {
    return paginateModel(this.messageModel, options, null, {
      conversation: conversationId,
    });
  }

  findMessagesForRoom(conversationId: string): Promise<Message[]> {
    const messages = this.messageModel.find(
      { conversation: conversationId },
      null,
      {
        sort: { createdAt: -1 },
      },
    );
    return messages;
  }

  async findOne(id: string) {
    try {
      const message = await this.messageModel.findById(id);
      if (!message) throw new MessageNotFoundException();
      return message;
    } catch (err) {
      throw new MessageNotFoundException();
    }
  }

  async update(params: EditMessageParams) {
    const message = await this.messageModel.findOneAndUpdate(
      { _id: params.messageId, sender: params.user._id },
      {
        content: params.updatemessageDto,
      },
      {
        new: true,
      },
    );

    if (!message) throw new CannotEditMessageException();
  }

  async delete(id: string) {
    const foundmessage = await this.findOne(id);
    return foundmessage.deleteOne();
  }
}
