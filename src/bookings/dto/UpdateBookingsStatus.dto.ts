import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['Pending', 'Confirmed', 'Cancelled'])
  bookingStatus: string;
}