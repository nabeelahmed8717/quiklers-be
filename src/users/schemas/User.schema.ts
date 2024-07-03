import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SellerProfile } from './SellerProfileSchema';
import { CollaboratorProfile } from './CollaboratorProfileSchema';

@Schema({ timestamps: true }) 
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  userRole: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile' })
  sellerProfile?: SellerProfile;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CollaboratorProfile' })
  collaboratorProfile?: CollaboratorProfile;

}

export const UserScheme = SchemaFactory.createForClass(User);
