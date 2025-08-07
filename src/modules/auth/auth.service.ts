import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { HashService } from './hash.service';
import { DatabaseService } from 'src/core/database/database.service';
import { passwordNotMatchErr, userExistsErr } from 'src/common/constants';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { IAccessToken, IAccessTokenPayload } from './types';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.databaseService.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    const { password: hash, ...rest } = user;

    const isMatch = await this.hashService.comparePassword(password, hash);

    if (!isMatch) throw new UnauthorizedException(passwordNotMatchErr);

    return rest;
  }

  login(user: User) {
    const payload: IAccessTokenPayload = { sub: user.id, email: user.email };

    const access_token = this.jwtService.sign(payload);

    return { access_token } as IAccessToken;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.databaseService.user.findFirst({
      where: { email: createUserDto.email },
      select: {
        id: true,
      },
    });

    if (user) {
      throw new ConflictException(userExistsErr);
    }

    const { password: rawPassword, ...rest } = createUserDto;

    const { hash } =
      await this.hashService.generateAndHashPassword(rawPassword);

    const data: CreateUserDto = {
      ...rest,
      password: hash,
    };

    const registered = await this.databaseService.user.create({
      data,
    });

    return this.login(registered);
  }
}
