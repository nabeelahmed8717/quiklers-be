import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['Pending', 'Accepted', 'Cancelled', 'Fulfilled'])
  bookingStatus: string;
}