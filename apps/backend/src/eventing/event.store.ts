
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DomainEvent } from './event.schema';

export class EventStore {
  constructor(@InjectModel(DomainEvent.name) private model: Model<DomainEvent>) {}

  append(event: Partial<DomainEvent>) {
    return this.model.create(event);
  }

  load(aggregateId: string) {
    return this.model.find({ aggregateId }).sort({ createdAt: 1 });
  }
}
