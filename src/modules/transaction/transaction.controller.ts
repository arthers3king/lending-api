import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import TransactionTypeEnum from 'src/enums/transaction-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetSummaryDto } from './dto/get-summary.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('lending')
  @UseGuards(AuthGuard('jwt'))
  async createLendingTransaction(@Body() body: CreateTransactionDto) {
    body.type = TransactionTypeEnum.BORROW;
    return this.transactionService.createTransaction(body);
  }

  @Post('repay')
  @UseGuards(AuthGuard('jwt'))
  async createRepayTransaction(@Body() body: CreateTransactionDto) {
    body.type = TransactionTypeEnum.REPAY;
    return this.transactionService.createTransaction(body);
  }

  @Post('summary')
  @UseGuards(AuthGuard('jwt'))
  async getSummary(@Body() body: GetSummaryDto) {
    return this.transactionService.getSummary(body.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getTransactions(@Query('userId') userId: number) {
    return this.transactionService.getTransactions(userId);
  }
}
