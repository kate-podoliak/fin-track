import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './database/models/user.model';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super();
  }

  serializeUser(user: any, done: any) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: any) {
    try {
      const user = await this.userModel.findByPk(userId);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
