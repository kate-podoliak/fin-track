import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthGuard} from "@nestjs/passport";
import {IsString, Matches, MaxLength, MinLength} from "class-validator";

class UpdatePassword {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  newPassword: string;
}
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}


  @UseGuards(AuthGuard('jwt'))
  @Get('username')
  async getCurrentUsername(@Req() req) {
    return this.usersService.getCurrentUsername(req.user.dataValues.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-name')
  async updateName(@Req() req, @Body('name') name: string) {
    return this.usersService.updateUserName(req.user.dataValues.id, name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-password')
  async updatePassword(@Req() req, @Body() passwordDto: UpdatePassword) {
    return this.usersService.updatePassword(req.user.dataValues.id, passwordDto.oldPassword, passwordDto.newPassword);
  }
}
