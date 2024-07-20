import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  address: string;

  @IsString()
  locationLink: string;
}

class EducationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}



class ServiceDto {
 
}

export class UpdateCollaboratorProfileDto {
  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsNumber()
  profileHourlyRate?: number;


  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ServiceDto)
  servicesDone?: ServiceDto[];

}