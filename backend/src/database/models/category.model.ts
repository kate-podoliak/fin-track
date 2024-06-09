import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Transaction } from './transaction.model';

@Table
export class Category extends Model<Category> {
  @Column
  name: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '#4f4f4f33',
  })
  color: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['income', 'expense']],
    },
  })
  type: 'income' | 'expense';

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
