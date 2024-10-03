import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

class ImageDto {
  @IsString()
  key: string;

  @IsString()
  mimetype: string;

  @IsNumber()
  size: number;

  @IsString()
  originalName: string;
}

export class CreateUserServiceDto {
  @IsOptional()
  @Type(() => ImageDto) // Specify the class type
  serviceImage: ImageDto;

  @IsNotEmpty()
  @IsString()
  serviceTitle: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  jobAvailabilityMode: string;

  @IsOptional()
  @IsString({ each: true })
  onlineCommunicationSoftware?: string; // Should be an array of strings
  
  @IsOptional()
  @IsString({ each: true })
  searchTags?: string; // Should be an array of strings

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  serviceType: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  serviceDescription: string;

  @IsOptional()
  @IsString()
  physicalAvailabilityMode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hourlyRate: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  createdBy: string; // User ID from token

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  serviceTypeTitle: string; // User ID from token

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fixedRate?: number; // Added property

  @IsOptional()
  @IsNumber()
  locationPreference?: number; // Added property

  @IsOptional()
  @IsString()
  priceType?: string; // Added property


  @IsOptional()
  @IsString()
  serviceAvailability?: string; // Added property
}
