import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import {
  ConnectedUser,
  ConnectedUserSchema,
  JoinedConversation,
  JoinedConversationSchema,
} from './entities';
import { ConnectedUserService, JoinedConversationService } from './services';
import { Gateway } from './gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConnectedUser.name, schema: ConnectedUserSchema },
      { name: JoinedConversation.name, schema: JoinedConversationSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  providers: [Gateway, ConnectedUserService, JoinedConversationService],
})
export class GatewayModule {}
