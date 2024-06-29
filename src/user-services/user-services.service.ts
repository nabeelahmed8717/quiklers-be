import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from './schema/UserService.schema';
import { CreateUserServiceDto } from './dto/CreateUserService.dto';
import { UpdateUserServiceDto } from './dto/UpdateUserService.dto';

@Injectable()
export class UserServicesService {
  // constructor(
  //   @InjectModel(UserService.name) private userServiceModel: Model<UserService>,
  // ) {}
  constructor(
    @InjectModel(UserService.name) private userServiceModel: Model<UserService>,
  ) {}

  async create(
    createUserServiceDto: CreateUserServiceDto,
  ): Promise<UserService> {
    const newUserService = new this.userServiceModel(createUserServiceDto);
    return newUserService.save();
  }

  // async findAll(): Promise<UserService[]> {
  //   return this.userServiceModel.find().exec();
  // }

  // async findAll(): Promise<UserService[]> {
  //   return this.userServiceModel.find().populate('createdBy').exec();
  // }

  async findAll(): Promise<UserService[]> {
    return this.userServiceModel.find().populate('createdBy').exec();
  }

  // async findOne(id: string): Promise<UserService> {
  //   return this.userServiceModel.findById(id).exec();
  // }

  async findOne(id: string): Promise<UserService> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userService = await this.userServiceModel
      .findById(id)
      .populate('createdBy')
      .exec();
    if (!userService) {
      throw new NotFoundException(`UserService with ID ${id} not found`);
    }
    return userService;
  }

  async update(id: string, updateUserServiceDto: UpdateUserServiceDto): Promise<UserService> {

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const userService = await this.userServiceModel.findByIdAndUpdate(id, updateUserServiceDto, { new: true }).populate('createdBy').exec();

    if (!userService) {
      throw new NotFoundException(`UserService with ID ${id} not found`);
    }

    return userService;
  }

  async remove(id: string): Promise<UserService> {
    return this.userServiceModel.findByIdAndDelete(id).exec();
  }
}
