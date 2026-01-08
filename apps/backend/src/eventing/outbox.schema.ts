
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OutboxEvent extends Document {
  @Prop() topic: string;
  @Prop() payload: any;
  @Prop({ default: false }) published: boolean;
}

export const OutboxEventSchema = SchemaFactory.createForClass(OutboxEvent);
OutboxEventSchema.index({ published: 1 });
