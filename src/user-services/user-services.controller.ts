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
} from '@nestjs/common';
import { UserServicesService } from './user-services.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserServiceDto } from './dto/CreateUserService.dto';
import { UpdateUserServiceDto } from './dto/UpdateUserService.dto';

@Controller('user-services')
export class UserServicesController {
  constructor(private readonly userServicesService: UserServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserServiceDto: CreateUserServiceDto, @Request() req) {
    createUserServiceDto.createdBy = req?.user?._doc._id;
    return this.userServicesService.create(createUserServiceDto);
  }

  @Get()
  findAll() {
    return this.userServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserServiceDto: UpdateUserServiceDto,
  ) {
    return this.userServicesService.update(id, updateUserServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userServicesService.remove(id);
  }
}
