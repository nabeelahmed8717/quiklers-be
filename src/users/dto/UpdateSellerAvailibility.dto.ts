import { IsBoolean } from 'class-validator';

export class UpdateSellerAvailabilityDto {
  @IsBoolean()
  availability: boolean;
}