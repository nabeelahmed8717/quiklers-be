import { IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateBookingPaymentDto {
  @IsNotEmpty()
  @IsEnum(['Unpaid', 'Paid', 'Refunded'])
  paymentStatus: string;
}
