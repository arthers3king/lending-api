import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GetSummaryDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userId: number;
}
