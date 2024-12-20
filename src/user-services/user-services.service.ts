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
import { Booking } from 'src/bookings/schema/CreateBookings.schema';
import { User } from 'src/users/schemas/User.schema';

@Injectable()
export class UserServicesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserService.name) private userServiceModel: Model<UserService>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

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
    pages: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
          $or: [
            { serviceTitle: { $regex: search, $options: 'i' } },
            { serviceDescription: { $regex: search, $options: 'i' } },
            { serviceType: { $regex: search, $options: 'i' } },
            { searchTags: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const userQuery = userId ? { createdBy: userId } : {};
    const query = { ...searchQuery, ...userQuery };

    const [data, total] = await Promise.all([
      this.userServiceModel
        .find(query)
        .sort({ createdAt: -1 })
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

    // Fetch servicesInfo for each service
    const enrichedData = await Promise.all(
      data.map(async (userService: any) => {
        // Check if createdBy exists
        if (!userService.createdBy || !userService.createdBy._id) {
          return {
            ...userService.toObject(),
            servicesInfo: [], // return an empty servicesInfo array if createdBy is not available
          };
        }

        const userId = userService.createdBy._id;
        const bookings = await this.bookingModel
          .find({
            ownerId: userId,
            bookingStatus: 'Fulfilled',
            serviceInfo: userService._id,
          })
          .populate({
            path: 'serviceInfo',
          })
          .populate({
            path: 'serviceReviewAndRatings.createdBy',
            select: 'firstName lastName userAvatar',
          })
          .select(
            'serviceInfo bookingStatus createdAt updatedAt serviceReviewAndRatings',
          );

        const servicesInfo = bookings.map((booking: any) => ({
          serviceInfo: booking?.serviceInfo,
          bookingId: booking?._id,
          bookingStatus: booking?.bookingStatus,
          createdAt: booking?.createdAt,
          updatedAt: booking?.updatedAt,
          serviceReviewAndRatings: booking?.serviceReviewAndRatings,
        }));

        return {
          ...userService.toObject(),
          servicesInfo,
        };
      }),
    );

    const pages = Math.ceil(total / limit);

    return {
      data: enrichedData,
      page,
      limit,
      total,
      pages,
    };
  }

  async findOne(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const userService: any = await this.userServiceModel
      .findById(id)
      .populate({
        path: 'createdBy',
        select: '_id',
      })
      .exec();
    if (!userService) {
      throw new NotFoundException(`Service not found`);
    }
    const userId = userService.createdBy._id;
    const sellerProfile = await this.userModel
      .findById(userId)
      .select('-password -__v -collaboratorProfile')
      .populate({
        path: 'sellerProfile',
        select: '-__v',
      });
    if (!sellerProfile) {
      throw new NotFoundException('Seller not found');
    }
    const bookings = await this.bookingModel
      .find({ ownerId: userId, bookingStatus: 'Fulfilled', serviceInfo: id })
      .populate({
        path: 'serviceInfo',
      })
      .populate({
        path: 'serviceReviewAndRatings.createdBy',
        select: 'firstName lastName userAvatar',
      })
      .select(
        'serviceInfo bookingStatus createdAt updatedAt serviceReviewAndRatings ',
      );

    const servicesInfo = bookings.map((booking: any) => ({
      serviceInfo: booking?.serviceInfo,
      bookingId: booking?._id,
      bookingStatus: booking?.bookingStatus,
      createdAt: booking?.createdAt,
      updatedAt: booking?.updatedAt,
      serviceReviewAndRatings: booking?.serviceReviewAndRatings,
    }));
    sellerProfile.sellerProfile.servicesInfo = servicesInfo;

    return {
      service: userService,
      sellerProfile,
      servicesInfo,
    };
  }

  async update(
    id: string,
    updateUserServiceDto: UpdateUserServiceDto,
  ): Promise<UserService> {
    return this.userServiceModel
      .findByIdAndUpdate(id, updateUserServiceDto, { new: true }) // Updates and returns updated document
      .exec();
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





  async searchServices(
    search: string,
  ): Promise<{
    searchTags: string[];
    services: { id: string; title: string }[];
  }> {
    if (!search || search?.length < 1) {
      return {
        searchTags: [],
        services: [],
      };
    }
  
    const simpleSearchQuery = {
      $or: [
        { serviceTitle: { $regex: search, $options: 'i' } },
        { serviceDescription: { $regex: search, $options: 'i' } },
        { serviceType: { $regex: search, $options: 'i' } },
      ],
    };
  
    const filteredServices = await this.userServiceModel
      .find(simpleSearchQuery)
      .exec();
  
    const relevantTags = new Set<string>(); 
    const tagCounts: Record<string, number> = {};
  
    filteredServices.forEach((service) => {
      const tags = Array.isArray(service.searchTags)
        ? service.searchTags
        : JSON.parse(service.searchTags || '[]');
      tags.forEach((tag) => {
        if (tag.toLowerCase().includes(search.toLowerCase())) {
          if (tagCounts[tag]) {
            tagCounts[tag]++;
          } else {
            tagCounts[tag] = 1;
          }
          relevantTags.add(tag);
        }
      });
    });
  
    const sortedRelevantTags = Array.from(relevantTags).sort((a, b) => {
      const countA = tagCounts[a] || 0;
      const countB = tagCounts[b] || 0;
  
      const exactMatchA = a.toLowerCase() === search.toLowerCase() ? 1 : 0;
      const exactMatchB = b.toLowerCase() === search.toLowerCase() ? 1 : 0;
  
      return exactMatchB - exactMatchA || countB - countA;
    });
  
    // Check if the search term exists in the tags
    if (!sortedRelevantTags.includes(search)) {
      // Add the search term to the top if it's not already in the tags
      sortedRelevantTags.unshift(search);
    }
  
    // Format the services and limit to top 10
    const formattedServices = filteredServices.map((service) => ({
      id: service._id.toString(),
      title: service.serviceTitle,
    }));
    const top10Services = formattedServices.slice(0, 10);
  
    return {
      searchTags: sortedRelevantTags, // Return searchTags with user's search value at the top
      services: top10Services,        // Return the top 10 services
    };
  }
  
  
}
