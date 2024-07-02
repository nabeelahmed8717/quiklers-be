import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  receiveNotifications?: boolean;
  @IsOptional()
  @IsBoolean()
  receiveEmails?: boolean;
  @IsOptional()
  @IsBoolean()
  receiveSMS?: boolean;
}

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
  @ValidateNested()
  @Type(() => CreateUserSettingsDto)
  sellerProfile?: CreateUserSettingsDto;
}
