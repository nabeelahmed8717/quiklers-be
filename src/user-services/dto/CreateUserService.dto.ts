import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserServiceDto {
  @IsNotEmpty()
  @IsString()
  serviceImage: string; // This could be a URL or a path to the image

  @IsNotEmpty()
  @IsString()
  serviceTitle: string;

  @IsNotEmpty()
  @IsNumber()
  ratings: number;

  @IsNotEmpty()
  @IsString()
  jobAvailabilityMode: string;

  @IsOptional()
  @IsString()
  onlineSoftware?: string;

  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsNotEmpty()
  @IsString()
  serviceDescription: string;

  @IsOptional()
  @IsString()
  physicalAvailabilityMode?: string;

  @IsNotEmpty()
  @IsNumber()
  hourlyRate: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  createdBy: string; // User ID from token
}
