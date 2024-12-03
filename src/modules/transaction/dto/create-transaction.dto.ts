import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import TransactionType from 'src/enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  lenderId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  borrowerId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  type: TransactionType;
}
