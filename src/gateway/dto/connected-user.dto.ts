import { User } from '../../user/entities/user.entity';

export class ConnectedUserDto {
  socketId: string;
  user: User;
}
