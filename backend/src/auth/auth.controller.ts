import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentials {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() authCredentials: AuthCredentials) {
    return this.authService.register(authCredentials);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check-auth')
  checkAuth(@Req() req) {
    return { isAuthenticated: !!req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  googleAuthRedirect(@Req() req, @Res() res) {
    const { token } = req.user;
    return res.redirect(`https://fin-track.eu/?token=${token}`);
  }
}
