import { IsPositive, IsInt, IsNotEmpty } from 'class-validator';

export class AddToWalletDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
