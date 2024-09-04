import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';

class ServiceReviewAndRatingsDto {
  @IsOptional()
  @IsString()
  serviceReview?: string;

  @IsOptional()
  @IsNumber()
  serviceRatings?: number;

  @IsOptional()
  @IsString()
  createdBy?: Types.ObjectId;

  @IsOptional()
  @IsString()
  serviceReply?: string;
}
export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  createdBy: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  serviceInfo: Types.ObjectId;

  @IsOptional()
  @IsEnum(['Pending', 'Accepted', 'Cancelled', 'fulfilled'])
  bookingStatus: string;

  @IsOptional()
  @IsEnum(['Unpaid', 'Paid', 'Refunded'])
  paymentStatus: string;

  // @IsOptional()
  // @IsString()
  // serviceRatings: number;

  // @IsOptional()
  // @IsString()
  // serviceReviews: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceReviewAndRatingsDto)
  serviceReviewAndRatings?: ServiceReviewAndRatingsDto;
}
