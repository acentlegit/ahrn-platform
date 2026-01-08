
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop() jobId: string;
  @Prop() technicianId: string;
  @Prop() amount: number;
  @Prop() etaHours: number;
  @Prop({ default: 'SUBMITTED' }) status: string;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
BidSchema.index({ jobId: 1 });
