import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';

class ServiceReviewAndRatingsDto {
  @IsOptional()
  @IsString()
  serviceReview?: string;

  @IsOptional()
  @IsNumber()
  serviceRatings?: number;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  serviceReply?: string;
}

export class AddBookingReviewsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ServiceReviewAndRatingsDto)
  serviceReviewAndRatings?: ServiceReviewAndRatingsDto;
}