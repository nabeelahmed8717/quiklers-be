import {
  BadRequestException,
  ForbiddenException,
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

  // async create(
  //   createUserServiceDto: CreateUserServiceDto,
  // ): Promise<UserService> {
  //   const newUserService = new this.userServiceModel(createUserServiceDto);
  //   return newUserService.save();
  // }


  // async create(
  //   createUserServiceDto: CreateUserServiceDto,
  // ): Promise<UserService> {
  //   const newUserService = new this.userServiceModel(createUserServiceDto);
  //   return newUserService.save();
  // }

  async create(
    createUserServiceDto: CreateUserServiceDto,
  ): Promise<UserService> {
    // Create a new UserService instance and save it
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

  async remove(id: string, userId: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const userService = await this.userServiceModel.findById(id).exec();
    if (!userService) {
      throw new NotFoundException('Service not found');
    }
    const createdById = userService?.createdBy?.toString(); // Convert to string
    const userIdSt = userId?.toString(); // Convert to string

    console.log('created', createdById);
    console.log('user', userIdSt);

    // Check if the `createdBy` field matches the userId
    if (createdById !== userIdSt) {
      throw new BadRequestException(
        'You are not authorized to delete this service',
      );
    }

    // Delete the service
    await this.userServiceModel.findByIdAndDelete(id).exec();

    return { message: 'User service deleted successfully' };
  }

  async getMyServices(userId: string): Promise<UserService[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const userServices = await this.userServiceModel
      .find({ createdBy: userId })
      .populate({
        path: 'createdBy',
        select: '-password', // Exclude the password field
      })
      .exec();

    if (!userServices || userServices.length === 0) {
      throw new NotFoundException(`No services found`);
    }

    return userServices;
  }
}
