import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './database/models/user.model';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './database/models/category.model';
import { Transaction } from './database/models/transaction.model';
import { ConfigModule } from '@nestjs/config';
import { Events } from './database/models/event.model';
import { EventModule } from './events/event.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Iloveyou0805!',
      database: 'dyplome',
      models: [User, Category, Transaction, Events],
    }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    DatabaseModule,
    UsersModule,
    TransactionsModule,
    CategoriesModule,
    AuthModule,
    EventModule,
  ],
})
export class AppModule {}
