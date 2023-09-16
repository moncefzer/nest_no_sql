import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ConnectedUserService, JoinedConversationService } from './services';
import { ServerEvents, SocketEvents } from '../core/utils/constants';
import { JoinConversationDto } from './dto';
import { OnEvent } from '@nestjs/event-emitter';
import { Conversation } from '../conversation/entities/conversation.entity';
import {
  CreateMessageEventPayload,
  DeleteMessageParams,
} from '../core/utils/types';
import { User } from 'src/user/entities/user.entity';

@WebSocketGateway()
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly joinedConversationService: JoinedConversationService,
  ) {}

  async onModuleInit() {
    await this.joinedConversationService.deleteAll();
    await this.connectedUserService.deleteAllConnetions();
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    try {
      // auth user
      //? will  throw 401 if not authorized
      const decodedToken = await this.authService.verifyJWT(
        socket.handshake.headers.authorization,
      );
      const user = await this.userService.findOne(decodedToken.sub);
      socket.data.user = user;

      // save user connection
      await this.connectedUserService.create({
        socketId: socket.id,
        user: user,
      });

      console.log(`${user.username} connected | ${socket.id} `);
    } catch (err) {
      console.log(err);
      this.handleDisconnect(socket, err.message);
    }
  }

  async handleDisconnect(socket: Socket, message?: string) {
    console.log(`${socket.data.user.username} disconnected | ${socket.id} `);
    message && socket.emit('error', message);
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage(SocketEvents.ON_CONVERSATION_JOIN)
  async onConversationJoin(socket: Socket, payload: JoinConversationDto) {
    const { conversationId } = payload;
    const user: User = socket.data.user;
    await this.joinedConversationService.create({
      conversation: conversationId,
      socketId: socket.id,
      user: user.id,
    });

    socket.join(`conversation-${payload.conversationId}`);
  }

  @SubscribeMessage(SocketEvents.ON_CONVERSATION_LEAVE)
  async onConversationLeave(socket: Socket, payload: JoinConversationDto) {
    await this.joinedConversationService.deletebySocketId(socket.id);
    socket.leave(`conversation-${payload.conversationId}`);
  }

  @OnEvent(ServerEvents.CONVERSATION_CREATE)
  async handleConversationCreateEvent(conversation: Conversation) {
    for (const participant of conversation.participants) {
      const connection = await this.connectedUserService.findByUser(
        participant.id,
      );

      connection &&
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.ON_CONVERSATION_CREATE, conversation);
    }
  }

  @OnEvent(ServerEvents.MESSAGE_CREATE)
  async handleMessageCreateEvent(payload: CreateMessageEventPayload) {
    const { conversation } = payload;

    for (const participant of conversation.participants) {
      const connection = await this.connectedUserService.findByUser(
        participant.id,
      );
      connection &&
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.ON_MESSAGE_CREATE, payload);
    }
  }

  @OnEvent(ServerEvents.MESSAGE_DELETE)
  async handleMessageDeleteEvent(payload: DeleteMessageParams) {
    console.log(payload);

    const usersInJoiningConvers =
      await this.joinedConversationService.findByConversation(
        payload.conversationId,
      );
    for (const participant of usersInJoiningConvers) {
      const connection = await this.connectedUserService.findByUser(
        participant.user as string,
      );
      connection &&
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.ON_MESSAGE_DELETE, payload);
    }
  }
}
