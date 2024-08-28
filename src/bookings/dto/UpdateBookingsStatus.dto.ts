import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(['Pending','InProgress', 'Cancelled', 'Fulfilled'])
  bookingStatus: string;
}
