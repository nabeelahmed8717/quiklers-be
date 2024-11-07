// create-company.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {

  @IsOptional()
  @IsString()
  companyName: string;
  
}
