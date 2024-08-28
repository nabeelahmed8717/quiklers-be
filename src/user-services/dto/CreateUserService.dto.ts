import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';


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
  @IsString()
  onlineSoftware?: string;

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
  @IsNotEmpty()
  @IsNumber()
  hourlyRate: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  createdBy: string; // User ID from token

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  serviceTypeTitle: string; // User ID from token
}


