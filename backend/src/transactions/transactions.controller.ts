import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

export interface TransactionInterface {
  categoryId?: number;
  amount?: number;
}

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTransaction(
    @Body() createTransaction: TransactionInterface,
    @Req() req,
  ) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('UserID is missing');
    }
    return this.transactionsService.createTransaction(
      createTransaction,
      userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions-incomes')
  async getTransactionsIncomes(@Req() req) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('UserID is missing');
    }
    return this.transactionsService.findTransactions(userId, 'income');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions-expenses')
  async getTransactionsExpenses(@Req() req) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('UserID is missing');
    }
    return this.transactionsService.findTransactions(userId, 'expense');
  }

  @Get()
  async findAllTransactions() {
    return this.transactionsService.findAllTransactions();
  }

  @Get(':id')
  async findOneTransaction(@Param('id') id: string) {
    return this.transactionsService.findOneTransaction(+id);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransaction: TransactionInterface,
  ) {
    return this.transactionsService.updateTransaction(+id, updateTransaction);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionsService.deleteTransaction(+id);
  }
}
