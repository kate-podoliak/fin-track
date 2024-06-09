import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from '../database/models/transaction.model';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Category } from '../database/models/category.model';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, Category])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
