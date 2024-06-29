import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // @UseGuards(LocalGuard)
  // login(@Body() authPayload: AuthPayloadDto) {
  //   const user = this.authService.validateUser(authPayload);
  //   return user;
  // }

  @Post('login')
  async login(@Body() authPayload: AuthPayloadDto) {
    const token = await this.authService.validateUser(authPayload);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { accessToken: token };
  }


  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req:Request){
    console.log("inside ath status")
    console.log('user', req.user)
  }


}
