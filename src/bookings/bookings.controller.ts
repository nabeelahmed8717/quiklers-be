import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/CreateBookings.dto';
import { UpdateBookingStatusDto } from './dto/UpdateBookingsStatus.dto';
import { UpdateBookingPaymentDto } from './dto/UpdateBookingsPayments.dto';
import { AddBookingReviewsDto } from './dto/AddBookingsReviews.dto';
import { UserServicesService } from 'src/user-services/user-services.service';
import { Types } from 'mongoose';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly userServicesService: UserServicesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    try {
      const serviceIdString = (
        createBookingDto.serviceInfo as Types.ObjectId
      ).toString();

      const service = await this.userServicesService.findOne(serviceIdString);

      if (!service) {
        throw new Error('Service not found');
      }

      const ownerId = service?.service?.createdBy?.['_id']?.toString();

      if (!ownerId) {
        throw new Error('Owner ID not found');
      }
      createBookingDto.ownerId = ownerId;
      createBookingDto.createdBy = req?.user?._id;

      return await this.bookingsService.create(createBookingDto);
    } catch (error) {
      console.error('Error creating booking:', error.message);
      throw new BadRequestException(
        'Failed to create booking. ' + error.message,
      );
    }
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req,
    @Query('fulfilled') fulfilled: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const userId = req?.user?._id;
    if (userId) {
      const status = fulfilled === 'true' ? 'Fulfilled' : null;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      return this.bookingsService.findAll(
        userId,
        status,
        pageNumber,
        limitNumber,
        search,
      );
    }
  }

  @Get('/requests')
  @UseGuards(JwtAuthGuard)
  async findAllBookingsRequests(
    @Request() req,
    @Query('fulfilled') fulfilled: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const userId = req?.user?._id;
    if (userId) {
      const status = fulfilled === 'true' ? 'Fulfilled' : null;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      return this.bookingsService.findAllBookingsRequests(
        userId,
        status,
        pageNumber,
        limitNumber,
        search,
      );
    }
  }

  @Patch(':id/update-status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateBookingStatusDto);
  }

  @Patch(':id/update-payment')
  @UseGuards(JwtAuthGuard)
  updatePayment(
    @Param('id') id: string,
    @Body() updateBookingPaymentDto: UpdateBookingPaymentDto,
  ) {
    return this.bookingsService.updatePayment(id, updateBookingPaymentDto);
  }


  @Patch(':id/add-reviews')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  addReviews(
    @Param('id') id: string,
    @Body() addReviewsDto: AddBookingReviewsDto,
  ) {
    return this.bookingsService.addReviews(id, addReviewsDto);
  }
}
