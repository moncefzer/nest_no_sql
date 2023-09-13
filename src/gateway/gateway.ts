import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ConnectedUserService, JoinedConversationService } from './services';
import { ServerEvents, SocketEvents } from 'src/core/utils/constants';
import { JoinConversationDto } from './dto';
import { User } from 'src/user/entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/messages/entities/message.entity';

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

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      // get user identity and make auth
      console.log(`client ${socket.id} connected`);
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
    } catch (err) {
      console.log(err);
      this.disconnect(socket, err.message);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log(`client ${socket.id} disconnected`);
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  disconnect(socket: Socket, message?: string) {
    socket.emit('error', message);
    socket.disconnect();
  }

  @SubscribeMessage(SocketEvents.ON_CONVERSATION_JOIN)
  async onConversationJoin(socket: Socket, payload: JoinConversationDto) {
    const { conversationId } = payload;
    const user: User = socket.data.user;
    const conversationJoin = await this.joinedConversationService.create({
      conversation: conversationId,
      socketId: socket.id,
      user,
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
        participant as User,
      );
      connection &&
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.ON_CONVERSATION_CREATE, conversation);
    }
  }

  @OnEvent(ServerEvents.MESSAGE_CREATE)
  async handleMessageCreateEvent(payload: {
    message: Message;
    conversation: Conversation;
  }) {
    const { message, conversation } = payload;

    for (const participant of conversation.participants) {
      const connection = await this.connectedUserService.findByUser(
        participant as User,
      );
      connection &&
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.ON_MESSAGE_CREATE, message);
    }
  }
}
