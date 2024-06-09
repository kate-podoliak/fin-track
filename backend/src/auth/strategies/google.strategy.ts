import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '../../database/models/user.model';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://fin-track.eu/api/auth/google/redirect`,
      scope: ['profile', 'email'],
      lang: 'ru',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails } = profile;
    const email = emails[0].value;
    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email: email,
        name: displayName,
        authType: 'google',
      });
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    done(null, { user, token });
  }
}