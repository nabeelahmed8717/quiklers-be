import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    createBookingDto.createdBy = req?.user?._id;
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    const userId = req?.user?._id;
    if (userId) {
      console.log('userId', userId);
      return this.bookingsService.findAll(userId);
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
