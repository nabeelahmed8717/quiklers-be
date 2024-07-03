import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Patch('update-user')
  @UsePipes(new ValidationPipe())
  updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req?.user?._doc?._id;
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
    const sellerProfileId = req?.user?._doc?.sellerProfile;
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
    const collaboratorProfileId = req?.user?._doc?.collaboratorProfile;
    const isValid = mongoose.Types.ObjectId.isValid(collaboratorProfileId);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    return this.usersService.updateCollaboratorProfile(
      collaboratorProfileId,
      updateCollaboratorProfileDto,
    );
  }
}
