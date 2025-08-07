import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from './hash.service';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/common/constants/envNames';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/core/database/database.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, LocalStrategy, JwtStrategy],
  exports: [AuthService, HashService],
})
export class AuthModule {}
