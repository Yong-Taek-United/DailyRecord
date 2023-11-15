import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';
import { CookieHelperService } from 'src/shared/services/cookie-helper.service';
import { LocalStrategy } from '../shared/strategies/local.strategy';
import { JwtStrategy } from '../shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../shared/strategies/jwt-refresh.strategy';
import { RefreshTokens } from 'src/shared/entities/refreshToken.entity';
import { JwtConfig } from '../shared/configs/jwt.config';
import { GoogleStrategy } from '../shared/strategies/google.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
    }),
    TypeOrmModule.forFeature([RefreshTokens]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenHelperService,
    CookieHelperService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
  exports: [TokenHelperService],
})
export class AuthModule {}
