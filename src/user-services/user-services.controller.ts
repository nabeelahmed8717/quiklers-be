import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserServicesService } from './user-services.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserServiceDto } from './dto/CreateUserService.dto';
import { UpdateUserServiceDto } from './dto/UpdateUserService.dto';

import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { FileInterceptorFactory } from 'src/common/decorators/file-interceptor.decorator';
import { CustomFile } from 'src/common/interfaces/Express.Multer.File';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

@Controller('user-services')
export class UserServicesController {
  constructor(private readonly userServicesService: UserServicesService) {}

  @Get('my-services')
  @UseGuards(JwtAuthGuard)
  async myServices(@Request() req) {
    const userId = req?.user?._id;
    return this.userServicesService.getMyServices(userId);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @FileInterceptorFactory('arr-quiklers') // Replace with your actual bucket name
  async create(
    @Body() createUserServiceDto: CreateUserServiceDto,
    @UploadedFile() file: CustomFile,
    @Request() req,
  ) {
    const userId = req?.user?._id;

    if (userId) {
      createUserServiceDto.createdBy = userId;
      if (file) {
        createUserServiceDto.serviceImage = {
          key: file.key,
          mimetype: file.mimetype,
          size: file.size,
          originalName: file.originalname,
        };
      }
      return this.userServicesService.create(createUserServiceDto);
    } else {
      throw new BadRequestException('User ID not provided');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('userId') userId?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.userServicesService.findAll(
      pageNumber,
      limitNumber,
      search,
      userId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userServicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateUserServiceDto: UpdateUserServiceDto,
  ) {
    return this.userServicesService.update(id, updateUserServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user._id;
    return this.userServicesService.remove(id, userId);
  }
}
