import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @ValidateNested()
  @Type(() => CreateSellerProfileDto)
  sellerProfile?: CreateSellerProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCollaboratorProfileDto)
  collaboratorProfile?: CreateCollaboratorProfileDto;
}
