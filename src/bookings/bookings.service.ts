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
    // const newBooking = new this.bookingModel(createBookingDto);
    // return newBooking.save();
    const newBooking = new this.bookingModel({
      ...createBookingDto,
      bookingStatus: 'Pending',
    });
    return newBooking.save();
  }

  async findAll(userId: string, status?: string): Promise<Booking[]> {
    const query: any = { createdBy: userId };
    if (status) {
      query.bookingStatus = status;
    } else {
      query.bookingStatus = { $ne: 'Fulfilled' };
    }
    return this.bookingModel
      .find(query)
      .populate('serviceInfo')
      .populate({
        path: 'serviceInfo',
        populate: {
          path: 'createdBy',
          select: 'firstName lastName',
        },
      })
      .exec();
  }

  async findAllBookingsRequests(
    userId: string,
    status?: string,
  ): Promise<Booking[]> {
    const query: any = {};

    // If status is provided, use it in the query
    if (status) {
      query.bookingStatus = status;
    } else {
      // Exclude 'Fulfilled' status if no status is provided
      query.bookingStatus = { $ne: 'Fulfilled' };
    }

    const bookings = await this.bookingModel
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
      .exec();
    return bookings.filter(
      (booking: any) =>
        booking?.serviceInfo?.createdBy?._id?.toString() === userId,
    );
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
  async addReviews(
    id: string,
    addBookingReviewsDto: AddBookingReviewsDto,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (addBookingReviewsDto.serviceReviews) {
      booking.serviceReviews = addBookingReviewsDto.serviceReviews;
    }
    if (addBookingReviewsDto.serviceRatings) {
      booking.serviceRatings = addBookingReviewsDto.serviceRatings;
    }
    return booking.save();
  }
}
