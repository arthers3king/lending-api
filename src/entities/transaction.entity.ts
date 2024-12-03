import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import TransactionTypeEnum from 'src/enums/transaction-type.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lentTransactions)
  lender: User;

  @ManyToOne(() => User, (user) => user.borrowedTransactions)
  borrower: User;

  @Column()
  amount: number;

  @Column({
    type: 'text',
    default: TransactionTypeEnum.BORROW,
  })
  type: TransactionTypeEnum;

  @CreateDateColumn()
  createdAt: Date;
}
