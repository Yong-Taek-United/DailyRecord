import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';
import { CookieHelperService } from 'src/shared/services/cookie-helper.service';
import { Public } from 'src/shared/decorators/skip-auth.decorator';
import { LoginDto } from '../shared/dto/auth.dto';
import { LocalAuthGuard } from '../shared/guards/local-auth.guard';
import { GoogleAuthGuard } from '../shared/guards/google-auth.guard';
import { JwtRefreshAuthGuard } from '../shared/guards/jwt-refresh-auth.guard';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokenHelperService: TokenHelperService,
    private readonly cookieHelperService: CookieHelperService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '회원을 인증하여 token을 발급해 클라이언트 cookie에 저장합니다.' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const tokens = await this.authService.login(req.user);

    await this.cookieHelperService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: user,
    };
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh Token 재발급',
    description: 'refreshToken을 이용해 token을 재발급합니다. <br> (refreshToken으로 자물쇠를 잠그십시오.)',
  })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user.user;
    const refreshToken = req.user.refreshToken;
    const tokens = await this.authService.refreshTokens(user, refreshToken);

    await this.cookieHelperService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: user,
    };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃', description: 'cookie에 저장된 token을 제거해 로그아웃합니다.' })
  async logout(@Req() req, @Res() res: Response) {
    const payload = await this.tokenHelperService.getPayloadFromToken(req);
    if (payload) await this.tokenHelperService.removeTokensFromUserDB(payload.sub);

    const cookieNames = ['accessToken', 'refreshToken'];
    await this.cookieHelperService.removeTokensFromCookies(res, cookieNames);

    return {
      statusCode: 200,
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokens = req.user.tokens;
    const redirectEndPoint = req.user.redirectEndPoint;

    await this.cookieHelperService.saveTokensToCookies(res, tokens);

    return {
      redirect: redirectEndPoint,
    };
  }
}
