import { IsOptional, IsString, IsNumber } from 'class-validator';

export class AddBookingReviewsDto {
  @IsOptional()
  @IsString()
  serviceReviews?: string;

  @IsOptional()
  @IsNumber()
  serviceRatings?: number;
}
