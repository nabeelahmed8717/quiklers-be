// update-company.dto.ts
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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


export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()    // O
  @IsString()
  address?: string;

  // Address Information
  @IsOptional()
  @IsString()
  headquarters?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  // Contact Information
  @IsOptional()
  @IsString()
  primaryContactName?: string;

  @IsOptional()
  @IsString()
  primaryContactPhone?: string;

  @IsOptional()
  @IsString()
  primaryContactEmail?: string;

  @IsOptional()
  @Type(() => ImageDto)
  logo: ImageDto;

  @IsOptional()
  @Type(() => ImageDto)
  taxDocument: ImageDto;

  @IsOptional()
  @Type(() => ImageDto)
  proofAddress: ImageDto;
}
