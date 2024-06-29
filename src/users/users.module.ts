import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './user.controller';
import { User, UserScheme } from './schemas/User.schema';
import { UserSettings, UserSettingsScheme } from './schemas/UsersSettingSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserScheme,
      },
      {
        name: UserSettings.name,
        schema: UserSettingsScheme,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
