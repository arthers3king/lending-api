import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/entities/user.entity';
import TransactionTypeEnum from 'src/enums/transaction-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTransaction(body: CreateTransactionDto) {
    const { lenderId, borrowerId, amount, type } = body;

    const lender = await this.userRepository.findOne({
      where: { id: lenderId },
    });
    if (!lender) {
      throw new NotFoundException(`Lender with ID ${lenderId} not found.`);
    }

    const borrower = await this.userRepository.findOne({
      where: { id: borrowerId },
    });
    if (!borrower) {
      throw new NotFoundException(`Borrower with ID ${borrowerId} not found.`);
    }

    if (type === TransactionTypeEnum.BORROW) {
      if (lender.wallet < amount) {
        throw new ForbiddenException(
          "The lender doesn't have enough money in pocket",
        );
      }

      lender.wallet -= amount; // คนให้ยืมลดเงินในกระเป๋า
      borrower.wallet += amount; // คนยืมเพิ่มเงินในกระเป๋า
    } else if (type === TransactionTypeEnum.REPAY) {
      if (borrower.wallet < amount) {
        throw new ForbiddenException(
          "The borrower doesn't have enough money in pocket",
        );
      }

      lender.wallet += amount;
      borrower.wallet -= amount;
    } else {
      throw new ForbiddenException('Invalid transaction type');
    }

    await this.userRepository.save(lender);
    await this.userRepository.save(borrower);

    const transaction = this.transactionRepository.create({
      lender,
      borrower,
      amount,
      type,
    });

    return this.transactionRepository.save(transaction);
  }

  async getSummary(userId: number) {
    const result = await this.transactionRepository
      .createQueryBuilder('txn') // เปลี่ยน alias จาก 'transaction' เป็น 'txn'
      .select(
        'SUM(CASE WHEN txn.type = :borrow THEN txn.amount ELSE - txn.amount END)',
        'balance',
      )
      .setParameters({ borrow: TransactionTypeEnum.BORROW })
      .where('txn.lenderId = :userId OR txn.borrowerId = :userId', {
        userId,
      })
      .getRawOne();

    return {
      userId,
      balance: result?.balance || 0,
    };
  }
  async getTransactions(userId: number) {
    const query = this.transactionRepository
      .createQueryBuilder('txn')
      .leftJoinAndSelect('txn.lender', 'lender')
      .leftJoinAndSelect('txn.borrower', 'borrower')
      .where('txn.lenderId = :userId OR txn.borrowerId = :userId', {
        userId,
      });

    const transactions = await query.orderBy('txn.createdAt', 'DESC').getMany();

    return transactions.map((transaction) => ({
      id: transaction.id,
      lender: transaction.lender.name,
      borrower: transaction.borrower.name,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.createdAt,
    }));
  }
}
