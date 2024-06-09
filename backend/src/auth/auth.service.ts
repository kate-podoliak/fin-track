import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // if (email === '') {
    //   throw new BadRequestException({
    //     email: 'Пожалуйста, введите email.',
    //   });
    // }
    //
    // if (password === '') {
    //   throw new BadRequestException({
    //     password: 'Пожалуйста, введите пароль.',
    //   });
    // }

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException({
        email: 'Не вдалося знайти користувача з введеним email.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException({ password: 'Неправильний пароль.' });
    }

    const { ...result } = user.get({ plain: true });
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async register(createUser: any): Promise<any> {
    if (!createUser.email) {
      throw new BadRequestException({
        email: 'Введіть електронну пошту.',
      });
    }
    if (!this.isValidEmail(createUser.email)) {
      throw new BadRequestException({
        email: 'Неправильний формат електронної пошти.',
      });
    }
    const existingUser = await this.userModel.findOne({
      where: { email: createUser.email },
    });
    if (existingUser) {
      throw new BadRequestException({
        email: 'Дана електронна пошта вже використовується.',
      });
    }
    if (!createUser.password) {
      throw new BadRequestException({
        password: 'Введіть пароль.',
      });
    }
    if (!this.isValidPassword(createUser.password)) {
      throw new BadRequestException({
        password:
          'Пароль повинен містити щонайменше 8 символів, включати заголовну літеру, цифру та спецсимвол.',
      });
    }
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const newUser = await this.userModel.create({
      ...createUser,
      password: hashedPassword,
    });
    const { ...result } = newUser.get({ plain: true });
    return result;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
}
