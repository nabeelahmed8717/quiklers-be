import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateCompanyDto } from './createCompany.dto';

export class CreateSellerProfileDto {}
export class CreateCollaboratorProfileDto {}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  userRole: string[];

  @IsOptional()
  country: string[];

  @IsOptional()
  isCompany: boolean;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateSellerProfileDto)
  // sellerProfile?: CreateSellerProfileDto;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateCollaboratorProfileDto)
  // collaboratorProfile?: CreateCollaboratorProfileDto;

  @ValidateIf((o) => o.isCompany)
  @Type(() => CreateCompanyDto)
  @ValidateNested()
  companyProfile?: CreateCompanyDto;

  @ValidateIf((o) => !o.isCompany)
  @Type(() => CreateSellerProfileDto)
  @ValidateNested()
  sellerProfile?: CreateSellerProfileDto;

  @ValidateIf((o) => !o.isCompany)
  @Type(() => CreateCollaboratorProfileDto)
  @ValidateNested()
  collaboratorProfile?: CreateCollaboratorProfileDto;
  
}
