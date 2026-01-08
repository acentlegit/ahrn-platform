
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop() claimId: string;
  @Prop() orgId: string;
  @Prop({ enum: ['BIDDING','ASSIGNED','IN_PROGRESS','DONE'] })
  status: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ orgId: 1, status: 1 });
