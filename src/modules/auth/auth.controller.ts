import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { User } from 'generated/prisma';
import { ILoginResponse } from './types';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: User }) {
    const { access_token } = this.authService.login(req.user);

    return {
      access_token,
      user: req.user,
    } as ILoginResponse;
  }

  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
