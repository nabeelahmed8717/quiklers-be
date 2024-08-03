import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  createdBy: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  serviceInfo: Types.ObjectId;

  @IsOptional()
  @IsEnum(['Pending', 'Accepted', 'Cancelled', 'fulfilled'])
  bookingStatus: string;

  @IsOptional()
  @IsEnum(['Unpaid', 'Paid', 'Refunded'])
  paymentStatus: string;

  @IsOptional()
  @IsString()
  serviceRatings: number;

  @IsOptional()
  @IsString()
  serviceReviews: string;

  @IsOptional()
  @IsString()
  bookingDate: string;

  @IsOptional()
  @IsString()
  bookingTime: string;

  @IsOptional()
  @IsString()
  bookingLocation: string;

  @IsOptional()
  @IsBoolean()
  isUrgent: boolean;
}
