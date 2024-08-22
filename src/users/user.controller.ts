import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/User.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateSellerProfileDto } from './dto/UpdateSellerProfile.dto';
import { UpdateCollaboratorProfileDto } from './dto/UpdateCollaboratorProfile.dto';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { FileInterceptorFactory } from 'src/common/decorators/file-interceptor.decorator';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Patch('update-user')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req?.user?._id;
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);

    const deletedUser = await this.usersService.deleteUser(id);
    console.log(deletedUser);
    if (!deletedUser) throw new HttpException('User not found', 404);
  }

  @Patch('seller-profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateSellerProfile(
    @Body() updateSellerProfileDto: UpdateSellerProfileDto,
    @Request() req,
  ) {
    const sellerProfileId = req?.user?.sellerProfile;
    const isValid = mongoose.Types.ObjectId.isValid(sellerProfileId);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.usersService.updateSellerProfile(
      sellerProfileId,
      updateSellerProfileDto,
    );
  }

  @Patch('collaborator-profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateCollaboratorProfile(
    @Body() updateCollaboratorProfileDto: UpdateCollaboratorProfileDto,
    @Request() req,
  ) {
    const collaboratorProfileId = req?.user?.collaboratorProfile;
    const isValid = mongoose.Types.ObjectId.isValid(collaboratorProfileId);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.usersService.updateCollaboratorProfile(
      collaboratorProfileId,
      updateCollaboratorProfileDto,
    );
  }

  @Patch('upload-image')
  @UseGuards(JwtAuthGuard)
  @FileInterceptorFactory(envConfig.AWS_S3_BUCKET_NAME)
  async uploadImage(@UploadedFile() file, @Request() req) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    const userId = req.user._id;
    const updatedUser = await this.usersService.updateUserImagePath(userId, {
      key: file.key,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    });
    return {
      message: 'Image uploaded successfully',
      user: updatedUser,
    };
  }

  //single profiles

  @Get('collaborator-profile')
  @UseGuards(JwtAuthGuard)
  async collaboratorProfile(@Request() req) {
    const userId = req?.user?._id;
    return this.usersService.getCollaboratorProfile(userId);
  }

  @Get('seller-profile')
  @UseGuards(JwtAuthGuard)
  async sellerProfile(@Request() req) {
    const userId = req?.user?._id;
    return this.usersService.getSellerProfile(userId);
  }


}
