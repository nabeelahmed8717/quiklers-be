// company.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop()
  companyName: string;

  @Prop()
  registrationNumber?: string;

  @Prop()
  businessType?: string;

  @Prop()
  industry?: string;

  @Prop()
  taxId?: string;

  @Prop()
  address?: string;

  @Prop()
  headquarters?: string;

  @Prop()
  streetAddress?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  country?: string;

  @Prop()
  primaryContactName?: string;

  @Prop()
  primaryContactPhone?: string;

  @Prop()
  primaryContactEmail?: string;


  @Prop({
    type: {
      url: String,
      key: String,
      mimetype: String,
      size: Number,
      originalName: String,
    },
  })
  logo: {
    key: string;
    mimetype: string;
    size: number;
    originalName: string;
  };

  @Prop({
    type: {
      url: String,
      key: String,
      mimetype: String,
      size: Number,
      originalName: String,
    },
  })
  proofAddress: {
    key: string;
    mimetype: string;
    size: number;
    originalName: string;
  };

  @Prop({
    type: {
      url: String,
      key: String,
      mimetype: String,
      size: Number,
      originalName: String,
    },
  })
  taxDocument: {
    key: string;
    mimetype: string;
    size: number;
    originalName: string;
  };


  //Verifications

  @Prop()
  isLogoDocVerifiedStatus?: string;
  @Prop()
  isTaxDocVerifiedStatus?: string;
  @Prop()
  isProofOfAddressVerifiedStatus?: string;

  
}

export const CompanySchema = SchemaFactory.createForClass(Company);
