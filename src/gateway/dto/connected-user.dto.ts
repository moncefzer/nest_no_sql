import { User } from 'src/user/entities/user.entity';

export class ConnectedUserDto {
  socketId: string;
  user: User;
}
