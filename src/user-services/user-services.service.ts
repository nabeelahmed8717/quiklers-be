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
  constructor(
    @InjectModel(UserService.name) private userServiceModel: Model<UserService>,
  ) {}

  async create(
    createUserServiceDto: CreateUserServiceDto,
  ): Promise<UserService> {
    const newUserService = new this.userServiceModel(createUserServiceDto);
    return newUserService.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    userId?: string,
  ): Promise<{
    data: UserService[];
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
          $or: [
            { serviceTitle: { $regex: search, $options: 'i' } },
            { serviceDescription: { $regex: search, $options: 'i' } },
            { serviceType: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const userQuery = userId ? { createdBy: userId } : {};
    const query = { ...searchQuery, ...userQuery };
    const [data, total] = await Promise.all([
      this.userServiceModel
        .find(query)
        .populate({
          path: 'createdBy',
          select: '-password',
          populate: [
            { path: 'collaboratorProfile' },
            { path: 'sellerProfile' },
          ],
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userServiceModel.countDocuments(query),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      lastPage,
    };
  }

  async findOne(id: string): Promise<UserService> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userService = await this.userServiceModel
      .findById(id)
      .populate('createdBy')
      .exec();
    if (!userService) {
      throw new NotFoundException(`Service not found`);
    }
    return userService;
  }

  async update(
    id: string,
    updateUserServiceDto: UpdateUserServiceDto,
  ): Promise<UserService> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userService = await this.userServiceModel
      .findByIdAndUpdate(id, updateUserServiceDto, { new: true })
      .populate('createdBy')
      .exec();
    if (!userService) {
      throw new NotFoundException(`Service not found`);
    }
    return userService;
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const deletedUserService = await this.userServiceModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedUserService) {
      throw new NotFoundException(`User service ID not found`);
    }

    return { message: 'User service deleted successfully' };
  }
}
