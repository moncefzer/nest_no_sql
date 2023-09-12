import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import RoomService from './services/room.service';
import { MessageService } from './services/message.service';
import { SocketEvents } from './utils';
import { ConnectedUserService } from './services/connected-user.service';
import { OnModuleInit } from '@nestjs/common';
import { JoinedRoomService } from './services/joined-room.service';
import { CreateMessageDto, CreateRoomDto, JoinRoomDto } from './dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly joinedRoomService: JoinedRoomService,
  ) {}

  async onModuleInit() {
    await this.joinedRoomService.deleteAll();
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

      // send user rooms he is in
      //todo : impl pagination
      const rooms = await this.roomService.findRoomsForUser(user);
      socket.emit(SocketEvents.rooms, rooms);
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

  @SubscribeMessage(SocketEvents.createRoom)
  async createRoom(socket: Socket, createRoomDto: CreateRoomDto) {
    const user = socket.data.user;

    const createdRoom = await this.roomService.create(user, createRoomDto);

    for (const user of createdRoom.users) {
      const connection = await this.connectedUserService.findByUser(user);
      if (connection) {
        this.server
          .to(connection.socketId)
          .emit(SocketEvents.createRoom, createdRoom);
      }
    }
  }

  @SubscribeMessage(SocketEvents.joinRoom)
  async onJoinRoom(socket: Socket, joinRoomDto: JoinRoomDto) {
    //* Save connection to Room
    await this.joinedRoomService.create({
      socketId: socket.id,
      room: joinRoomDto.roomId,
      user: socket.data.user,
    });

    //todo: impl pagination
    // const messages = await this.messageService.findMessagesForRoom(room, {
    //   limit: 10,
    //   page: 1,
    // });
    const messages = await this.messageService.findMessagesForRoom(
      joinRoomDto.roomId,
    );
    //* Send last messages from room to server
    this.server.to(socket.id).emit(SocketEvents.messages, messages);
  }

  @SubscribeMessage(SocketEvents.leaveRoom)
  async onLeaveRoom(socket: Socket) {
    await this.joinedRoomService.deletebySocketId(socket.id);
  }

  @SubscribeMessage(SocketEvents.addMessage)
  async onAddMessage(socket: Socket, createMessageDto: CreateMessageDto) {
    const createdMessage = await this.messageService.create(
      socket.data.user,
      createMessageDto,
    );

    // const room = await this.roomService.getRoom(createdMessage.room._id);
    const joinedUsers = await this.joinedRoomService.findByRoom(
      createMessageDto.roomId,
    );
    // //TODO : Send new message to all joined users (currently online)
    for (const joindUser of joinedUsers) {
      this.server
        .to(joindUser.socketId)
        .emit(SocketEvents.messageAdded, createdMessage);
    }
    //todo : for connected users and they are not in the chat send theme notifications
  }
}
