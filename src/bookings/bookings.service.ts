import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './schema/CreateBookings.schema';
import { CreateBookingDto } from './dto/CreateBookings.dto';
import { Model, Types } from 'mongoose';
import { UpdateBookingStatusDto } from './dto/UpdateBookingsStatus.dto';
import { UpdateBookingPaymentDto } from './dto/UpdateBookingsPayments.dto';
import { AddBookingReviewsDto } from './dto/AddBookingsReviews.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { FirebaseService } from 'src/firebase-cm/firebase.service';
import { User } from 'src/users/schemas/User.schema';
import { FcmToken } from 'src/users/schemas/CreateFcmToken.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(FcmToken.name) private fcmTokenModel: Model<FcmToken>,
    private readonly eventsGateway: EventsGateway,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel({
      ...createBookingDto,
      bookingStatus: 'Pending',
    });

    const savedBooking = await newBooking.save();

    const populatedBooking = await this.bookingModel
      .findById(savedBooking._id)
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

    // Emit the new booking event to the user's socket
    const userId: any = savedBooking.ownerId.toString();
    this.eventsGateway.emitNewBooking(userId, populatedBooking);

    const fcmTokenDoc = await this.fcmTokenModel
      .findOne({ userId: userId })
      .exec();
    console.log('fcmTokenDoc', fcmTokenDoc?.token);

    // const user:any = await this.userModel.findOne(userId);

    if (fcmTokenDoc?.token) {
      await this.firebaseService.sendNotification(
        fcmTokenDoc?.token,
        'New Booking Created',
        `Your booking for ${populatedBooking.serviceInfo.serviceTitle} is successfully created.`,
      );
    }

    return savedBooking;
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

  async addReviews(
    id: string,
    addBookingReviewsDto: AddBookingReviewsDto,
  ): Promise<Booking> {
    const booking: any = await this.bookingModel.findById(id);
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
