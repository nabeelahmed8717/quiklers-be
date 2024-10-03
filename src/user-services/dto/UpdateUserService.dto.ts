import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';


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

export class UpdateUserServiceDto {
  @IsOptional()
  @Type(() => ImageDto) // Specify the class type
  serviceImage: ImageDto;

  @IsOptional()
  @IsString()
  serviceTitle?: string;
  
  @IsOptional()
  @IsString()
  serviceTypeTitle?: string;

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsOptional()
  @IsString()
  jobAvailabilityMode?: string;

  @IsOptional()
  @IsString({ each: true })
  onlineCommunicationSoftware?: string; // Changed to an array

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  serviceDescription?: string;

  @IsOptional()
  @IsString()
  physicalAvailabilityMode?: string;

  @IsOptional()
  @IsNumber()
   @Type(() => Number)
  hourlyRate?: number;

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
  @IsString({ each: true })
  searchTags?: string; // Changed to an array

  @IsOptional()
  @IsString()
  serviceAvailability?: string; // Added property

  @IsOptional()
  @IsString()
  createdBy?: string;
}
