// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserServiceDto } from './CreateUserService.dto';

// export class UpdateUserServiceDto extends PartialType(CreateUserServiceDto) {}
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserServiceDto {
  @IsOptional()
  @IsString()
  serviceImage?: string;

  @IsOptional()
  @IsString()
  serviceTitle?: string;

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsOptional()
  @IsString()
  jobAvailabilityMode?: string;

  @IsOptional()
  @IsString()
  onlineSoftware?: string;

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
  hourlyRate?: number;

}
