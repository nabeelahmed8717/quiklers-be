import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { User, UserScheme } from './schemas/User.schema';
import { SellerProfile, SellerProfileScheme } from './schemas/SellerProfileSchema';
import { CollaboratorProfile, CollaboratorProfileScheme } from './schemas/CollaboratorProfileSchema';

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
      {
        name: CollaboratorProfile.name,
        schema: CollaboratorProfileScheme,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
