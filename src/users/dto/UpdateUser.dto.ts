import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    firstName: string;
  
    @IsOptional()
    @IsString()
    lastName?: string;
  
    @IsOptional()
    @IsString()
    email?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    username?: string;
  
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    userRole?: string[];

    @IsOptional()
    userAvatar?: {
      key: string;
      mimetype: string;
      size: number;
      originalName: string;
    };

    
}