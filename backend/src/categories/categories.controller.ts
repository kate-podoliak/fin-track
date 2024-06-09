import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

export interface CreateCategory {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface UpdateCategory {
  name: string;
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-category')
  createCategory(@Body() createCategories: CreateCategory, @Req() req) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('Відсутній ідентифікатор користувача.');
    }
    return this.categoriesService.createCategory(createCategories, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-categories/:type')
  findMyCategoriesByType(
    @Req() req,
    @Param('type') type: 'income' | 'expense',
  ) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('Відсутній ідентифікатор користувача.');
    }
    return this.categoriesService.findAllCategories(userId, type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('expenses')
  getExpensesByCategory(@Req() req) {
    const userId = req.user.dataValues.id;
    return this.categoriesService.getExpensesByCategory(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('incomes')
  getIncomesByCategory(@Req() req) {
    const userId = req.user.dataValues.id;
    return this.categoriesService.getIncomesByCategory(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.categoriesService.deleteCategory(id);
    return { message: 'Категорія видалена.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategory: UpdateCategory,
  ) {
    console.log(updateCategory);
    return this.categoriesService.updateCategory(id, updateCategory);
  }
}
