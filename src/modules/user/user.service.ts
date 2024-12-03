import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import TransactionTypeEnum from 'src/enums/transaction-type.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { name }],
    });

    if (existingUser) {
      throw new ConflictException('Email or name already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      wallet: 0,
    });

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // ยอดหนี้ที่ผู้ใช้นี้ติดหนี้คนอื่น
    const debtToOthers = await this.userRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.borrowerId = :userId', { userId })
      .andWhere('transaction.type = :borrow', {
        borrow: TransactionTypeEnum.BORROW,
      })
      .getRawOne();

    // ยอดหนี้ที่คนอื่นติดหนี้ผู้ใช้นี้
    const debtFromOthers = await this.userRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.lenderId = :userId', { userId })
      .andWhere('transaction.type = :borrow', {
        borrow: TransactionTypeEnum.BORROW,
      })
      .getRawOne();

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
      },
      debts: {
        debtToOthers: debtToOthers.total || 0, // หนี้ที่เราต้องคืนคนอื่น
        debtFromOthers: debtFromOthers.total || 0, // หนี้ที่คนอื่นติดเรา
      },
    };
  }

  async topUpToWallet(
    userId: number,
    amount: number,
  ): Promise<{
    status: string;
    message: string;
  }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.wallet += amount;

    this.userRepository.save(user);

    return {
      status: 'success',
      message: `Top up to wallet with id ${userId} success`,
    };
  }
}
