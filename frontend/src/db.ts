import Dexie from 'dexie';
interface Category {
    id?: number;
    name: string;
    type: string;
    color: string;
    synced?: boolean;
}

interface Income {
    id?: number;
    categoryId: number;
    amount: number;
    description: string;
    type: string;
    createdAt: string;
    synced?: boolean;
}

interface Expense {
    id?: number;
    categoryId: number;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
    synced?: boolean;
}
class MyDatabase extends Dexie {
    categories: Dexie.Table<Category, number>;
    incomes: Dexie.Table<Income, number>;
    expenses: Dexie.Table<Expense, number>;


    constructor() {
        super('MyDatabase');
        this.version(1).stores({
            categories: '++id, name, type, color, &synced',
            incomes: '++id, categoryId, amount, description, type, createdAt, &synced',
            expenses: '++id, categoryId, amount, description, type, createdAt, &synced'
        });

        this.categories = this.table("categories");
        this.incomes = this.table("incomes");
        this.expenses = this.table("expenses");
    }

    async getAllIncomes() {
        return this.incomes.toArray();
    }

    async getAllExpenses() {
        return this.expenses.toArray();
    }

    async getIncomeData() {
        let categories = await this.categories
          .filter(c => c.type === "income")
          .toArray();
        let transactions = await this.incomes.toArray();

        let categoriesData = categories.map(category => {
            let categoryTransactions = transactions
              .filter(t => t.categoryId === category.id)
              .map(t => ({
                  id: t.id ?? -1,
                  amount: t.amount,
                  createdAt: t.createdAt,
                  description: t.description
              }));

            let total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

            return {
                categoryId: category.id ?? -1,
                categoryName: category.name,
                color: category.color,
                transactions: categoryTransactions,
                total: total
            };
        });

        let totalIncomes = categoriesData.reduce((sum, category) => sum + category.total, 0);

        return {
            totalIncomes,
            categories: categoriesData
        };
    }


    async getExpenseData() {
        let categories = await this.categories
          .filter(c => c.type === "expense")
          .toArray();
        let transactions = await this.expenses.toArray();

        let categoriesData = categories.map(category => {
            let categoryTransactions = transactions
              .filter(t => t.categoryId === category.id)
              .map(t => ({
                  id: t.id ?? -1,
                  amount: t.amount,
                  createdAt: t.createdAt,
                  description: t.description
              }));

            let total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

            return {
                categoryId: category.id ?? -1,
                categoryName: category.name,
                color: category.color,
                transactions: categoryTransactions,
                total: total
            };
        });

        let totalExpenses = categoriesData.reduce((sum, category) => sum + category.total, 0);

        return {
            totalExpenses,
            categories: categoriesData
        };
    }

    async deleteCategory(categoryId: number) {
        return this.transaction('rw', this.categories, this.incomes, async () => {
            await this.incomes
              .where({ categoryId: categoryId })
              .delete();
            await this.categories.delete(categoryId);
        });
    }
    async deleteIncome(incomeId: number) {
        return this.incomes.delete(incomeId);
    }
    async deleteExpense(expenseId: number) {
        return this.expenses.delete(expenseId);
    }
    async updateCategory(categoryId: number, updatedData: Partial<Category>) {
        await this.categories.update(categoryId, updatedData);
    }

    async updateIncome(incomeId: number, updatedData: Partial<Income>) {
        await this.incomes.update(incomeId, updatedData);
    }

    async updateExpense(expenseId: number, updatedData: Partial<Expense>) {
        await this.expenses.update(expenseId, updatedData);
    }
}
const db = new MyDatabase();

export default db;
