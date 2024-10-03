import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFcmTokenDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
