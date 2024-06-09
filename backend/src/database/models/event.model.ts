import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

export enum SubscriptionStatus {
  Active = 'Active',
  Ending = 'Ending',
}

@Table
export class Events extends Model<Events> {
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.ENUM,
    values: Object.values(SubscriptionStatus),
    defaultValue: SubscriptionStatus.Active,
  })
  status: SubscriptionStatus;

  @BelongsTo(() => User)
  user: User;
}
