import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FcmToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;
}

export const FcmTokenSchema = SchemaFactory.createForClass(FcmToken);
