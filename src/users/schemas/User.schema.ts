import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SellerProfile } from './SellerProfileSchema';
import { CollaboratorProfile } from './CollaboratorProfileSchema';

@Schema({ timestamps: true }) 
export class User {
  toObject(): { [x: string]: any; password: any; } {
    throw new Error('Method not implemented.');
  }
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

  // EXP 

  @Prop()
  country: string;

  // @Prop()
  // userAvatar: string;
  @Prop({
    type: {
      url: String,
      key: String,
      mimetype: String,
      size: Number,
      originalName: String,
    },
  })
  userAvatar: {
    // url: string;
    key: string;
    mimetype: string;
    size: number;
    originalName: string;
  };

}


export const UserScheme = SchemaFactory.createForClass(User);
