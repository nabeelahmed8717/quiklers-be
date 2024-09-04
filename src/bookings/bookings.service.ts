import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './schema/CreateBookings.schema';
import { CreateBookingDto } from './dto/CreateBookings.dto';
import { Model } from 'mongoose';
import { UpdateBookingStatusDto } from './dto/UpdateBookingsStatus.dto';
import { UpdateBookingPaymentDto } from './dto/UpdateBookingsPayments.dto';
import { AddBookingReviewsDto } from './dto/AddBookingsReviews.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    
    const newBooking = new this.bookingModel({
      ...createBookingDto,
      bookingStatus: 'Pending',
    });
    return newBooking.save();
  }



  async findAll(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Booking[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    
    // Building the query
    const query: any = { createdBy: userId };
    if (status) {
      query.bookingStatus = status;
    } else {
      query.bookingStatus = { $ne: 'Fulfilled' };
    }
  
    // Adding search functionality
    if (search) {
      query.$or = [
        { 'serviceInfo.serviceTitle': { $regex: search, $options: 'i' } },
        { 'serviceInfo.serviceDescription': { $regex: search, $options: 'i' } },
      ];
    }
  
    // Fetch data and count total documents
    const [data, total] = await Promise.all([
      this.bookingModel
        .find(query)
        .populate('serviceInfo')
        .populate({
          path: 'serviceInfo',
          populate: {
            path: 'createdBy',
            select: 'firstName lastName',
          },
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(query),
    ]);
  
    const pages = Math.ceil(total / limit);
  
    return {
      data,
      total,
      page,
      pages,
      limit,
    };
  }
  

  async findAllBookingsRequests(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Booking[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
  
    const query: any = {};
  
    // If status is provided, use it in the query
    if (status) {
      query.bookingStatus = status;
    } else {
      // Exclude 'Fulfilled' status if no status is provided
      query.bookingStatus = { $ne: 'Fulfilled' };
    }
  
    // Adding search functionality
    if (search) {
      query.$or = [
        { 'serviceInfo.serviceTitle': { $regex: search, $options: 'i' } },
        { 'serviceInfo.serviceDescription': { $regex: search, $options: 'i' } },
      ];
    }
  
    // Fetch data and count total documents
    const [data, total] = await Promise.all([
      this.bookingModel
        .find(query)
        .populate('serviceInfo')
        .populate({
          path: 'createdBy',
          select: 'firstName lastName',
        })
        .populate({
          path: 'serviceInfo',
          populate: {
            path: 'createdBy',
            select: 'firstName lastName',
          },
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(query),
    ]);
  
    // Filter the results where the createdBy field in serviceInfo matches userId
    const filteredData = data.filter(
      (booking: any) =>
        booking?.serviceInfo?.createdBy?._id?.toString() === userId,
    );
  
    const pages = Math.ceil(total / limit);
  
    return {
      data: filteredData,
      total,
      page,
      pages,
      limit,
    };
  }

  
  // Update booking status
  async updateStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    booking.bookingStatus = updateBookingStatusDto.bookingStatus;
    return booking.save();
  }

  // Update payment status
  async updatePayment(
    id: string,
    updateBookingPaymentDto: UpdateBookingPaymentDto,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    booking.paymentStatus = updateBookingPaymentDto.paymentStatus;
    return booking.save();
  }

  // Add reviews
  // async addReviews(
  //   id: string,
  //   addBookingReviewsDto: AddBookingReviewsDto,
  // ): Promise<Booking> {
  //   const booking = await this.bookingModel.findById(id);
  //   if (!booking) {
  //     throw new NotFoundException('Booking not found');
  //   }
  //   if (addBookingReviewsDto.serviceReviews) {
  //     booking.serviceReviews = addBookingReviewsDto.serviceReviews;
  //   }
  //   if (addBookingReviewsDto.serviceRatings) {
  //     booking.serviceRatings = addBookingReviewsDto.serviceRatings;
  //   }
  //   return booking.save();
  // }

  async addReviews(
    id: string,
    addBookingReviewsDto: AddBookingReviewsDto,
  ): Promise<Booking> {
    const booking:any = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (addBookingReviewsDto.serviceReviewAndRatings) {
      booking.serviceReviewAndRatings = {
        ...booking.serviceReviewAndRatings,
        ...addBookingReviewsDto.serviceReviewAndRatings,
      };
    }

    return booking.save();
  }

}
