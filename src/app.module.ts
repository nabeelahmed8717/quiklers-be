import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserServicesModule } from './user-services/user-services.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/quiklers'),
    UsersModule,
    AuthModule,
    UserServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
