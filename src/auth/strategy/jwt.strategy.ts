import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../core/interfaces/token-payload';
import { ConfigConsts } from '../../core/utils/config-consts';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get(ConfigConsts.JWT_SECRET),
    });
  }

  async validate(payload: TokenPayload) {
    try {
      const userId = payload.sub;
      const user = await this.userService.findOne(userId);
      return user;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
