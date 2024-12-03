import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AddToWalletDto } from './dto/add-to-wallet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserProfile(@Param('userId') userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @Post('wallet/top-up')
  @UseGuards(AuthGuard('jwt'))
  async topUpToWallet(@Body() addToWalletDto: AddToWalletDto) {
    const { userId, amount } = addToWalletDto;
    return this.userService.topUpToWallet(userId, amount);
  }
}
