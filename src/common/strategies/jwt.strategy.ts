import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/common/constants/envNames';
import { IAccessTokenPayload } from 'src/modules/auth/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get(JWT_SECRET) as string,
    });
  }

  validate(payload: IAccessTokenPayload) {
    const { sub: userId, email } = payload;
    return { userId, email };
  }
}
