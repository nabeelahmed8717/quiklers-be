import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  createdBy: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  serviceInfo: Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(['Pending', 'Confirmed', 'Cancelled'])
  bookingStatus: string;

  @IsNotEmpty()
  @IsEnum(['Unpaid', 'Paid', 'Refunded'])
  paymentStatus: string;

  @IsOptional()
  @IsString()
  serviceRatings: number;

  @IsOptional()
  @IsString()
  serviceReviews: string;
}
