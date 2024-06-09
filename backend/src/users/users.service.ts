import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { User } from '../database/models/user.model';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getCurrentUsername(userId: number): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new BadRequestException('Користувач не знайден');
    }
    return { name: user.name };
  }

  async updateUserName(userId: number, newName: string): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new BadRequestException('Користувач не знайден');
    }
    user.name = newName;
    await user.save();
    return user.get({ plain: true });
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<any> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new BadRequestException('Користувач не знайден');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Невірний старий пароль.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }
}
