import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '../database/models/category.model';
import { Transaction } from '../database/models/transaction.model';
import { CreateCategory, UpdateCategory } from './categories.controller';

export interface ExpenseSum {
  totalExpenses: number;
  categories: {
    categoryId: number;
    categoryName: string;
    total: number;
    percentage: number;
  }[];
}

export interface IncomesSum {
  totalIncomes: number;
  categories: {
    categoryId: number;
    categoryName: string;
    total: number;
    percentage: number;
  }[];
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async createCategory(
    createCategory: CreateCategory,
    userId: number,
  ): Promise<Category> {
    return this.categoryModel.create({ ...createCategory, userId });
  }

  async findAllCategories(
    userId: number,
    type: 'income' | 'expense',
  ): Promise<Category[]> {
    return this.categoryModel.findAll({ where: { userId, type } });
  }

  async getExpensesByCategory(userId: number): Promise<ExpenseSum> {
    const categories = await this.categoryModel.findAll({
      where: { userId, type: 'expense' },
    });
    let totalExpenses = 0;

    const expensesByCategory = await Promise.all(
      categories.map(async (category) => {
        const transactions = await Transaction.findAll({
          where: { categoryId: category.id },
          attributes: ['id', 'createdAt', 'amount', 'description'],
        });
        const total = transactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0,
        );
        totalExpenses += total;

        return {
          categoryId: category.id,
          color: category.color,
          categoryName: category.name,
          transactions: transactions,
          total: total,
        };
      }),
    );

    const result = expensesByCategory.map((category) => ({
      ...category,
      percentage: totalExpenses ? (category.total / totalExpenses) * 100 : 0,
    }));

    return { totalExpenses, categories: result };
  }

  async getIncomesByCategory(userId: number): Promise<IncomesSum> {
    const categories = await this.categoryModel.findAll({
      where: { userId, type: 'income' },
    });
    let totalIncomes = 0;

    const incomesByCategory = await Promise.all(
      categories.map(async (category) => {
        const transactions = await Transaction.findAll({
          where: { categoryId: category.id },
          attributes: ['id', 'createdAt', 'amount', 'description'],
        });

        const total = transactions.reduce(
          (sum, transaction) => sum + Number(transaction.amount),
          0,
        );

        totalIncomes += total;

        return {
          categoryId: category.id,
          color: category.color,
          categoryName: category.name,
          transactions: transactions,
          total: total,
        };
      }),
    );

    const result = incomesByCategory.map((category) => ({
      ...category,
      percentage: totalIncomes
        ? Number(((category.total / totalIncomes) * 100).toFixed(2))
        : 0,
    }));

    return { totalIncomes, categories: result };
  }

  async deleteCategory(id: number): Promise<void> {
    await Transaction.destroy({
      where: { categoryId: id },
    });

    await this.categoryModel.destroy({
      where: { id },
    });
  }

  async removeTransaction(transactionId: number): Promise<void> {
    await Transaction.destroy({
      where: { id: transactionId },
    });
  }

  async updateCategory(
    id: number,
    updateCategory: UpdateCategory,
  ): Promise<Category> {
    await this.categoryModel.update(updateCategory, { where: { id } });
    return this.categoryModel.findByPk(id);
  }
}
