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
import { CustomRequest } from 'src/common/interfaces/common.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  status(@Req() req: Request) {
    console.log('inside ath status');
    console.log('user', req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: CustomRequest) {
    const userId = req?.user?._id; 
    return this.authService.getUserById(userId);
  }
}
