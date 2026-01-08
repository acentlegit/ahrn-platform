
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DomainEvent extends Document {
  @Prop() aggregateId: string;
  @Prop() type: string;
  @Prop() payload: any;
}

export const DomainEventSchema = SchemaFactory.createForClass(DomainEvent);
DomainEventSchema.index({ aggregateId: 1 });
