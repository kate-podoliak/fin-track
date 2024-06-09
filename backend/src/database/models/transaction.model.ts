import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';

@Table
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
  })
  categoryId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['income', 'expense']],
    },
  })
  type: 'income' | 'expense';

  @BelongsTo(() => Category)
  category: Category;
}
