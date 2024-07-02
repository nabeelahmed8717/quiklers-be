import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { User, UserScheme } from './schemas/User.schema';
import { SellerProfile, SellerProfileScheme } from './schemas/SellerProfileSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserScheme,
      },
      {
        name: SellerProfile.name,
        schema: SellerProfileScheme,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
