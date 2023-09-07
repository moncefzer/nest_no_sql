import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Message, MessageSchema } from './entities/message.entity';
import { Room, RoomSchema } from './entities/room.entity';
import { MessageService } from './services/message.service';
import RoomService from './services/room.service';
import {
  ConnectedUser,
  ConnectedUserSchema,
} from './entities/connected-user.entity';
import { ConnectedUserService } from './services/connected-user.service';
import { JoinedRoom, JoinedRoomSchema } from './entities/joined-room.entity';
import { JoinedRoomService } from './services/joined-room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ConnectedUser.name, schema: ConnectedUserSchema },
      { name: JoinedRoom.name, schema: JoinedRoomSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [
    ChatGateway,
    MessageService,
    RoomService,
    ConnectedUserService,
    JoinedRoomService,
  ],
})
export class ChatModule {}
