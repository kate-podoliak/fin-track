import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../database/models/transaction.model';
import { Category } from '../database/models/category.model';
import { TransactionInterface } from './transactions.controller';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async createTransaction(
    transactionData: TransactionInterface,
    userId: number,
  ): Promise<Transaction> {
    return this.transactionModel.create({ ...transactionData, userId });
  }

  async findTransactions(
    userId: number,
    type: 'income' | 'expense',
  ): Promise<Transaction[]> {
    return await this.transactionModel.findAll({
      where: { userId, type },
      include: [{ model: this.categoryModel, attributes: ['name', 'color'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findAllTransactions(): Promise<Transaction[]> {
    return this.transactionModel.findAll();
  }

  async findOneTransaction(id: number): Promise<Transaction> {
    return this.transactionModel.findByPk(id);
  }

  async updateTransaction(
    id: number,
    transactionData: TransactionInterface,
  ): Promise<Transaction[]> {
    await this.transactionModel.update(transactionData, { where: { id } });
    return this.transactionModel.findAll({ where: { id } });
  }

  async deleteTransaction(id: number): Promise<void> {
    const transaction = await this.findOneTransaction(id);
    await transaction.destroy();
  }
}
