import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  name: string;

  @Column()
  wallet: number;

  @OneToMany(() => Transaction, (transaction) => transaction.lender)
  lentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.borrower)
  borrowedTransactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
