
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OutboxEvent } from './outbox.schema';

export class OutboxWorker {
  constructor(@InjectModel(OutboxEvent.name) private model: Model<OutboxEvent>) {}

  async publish() {
    const events = await this.model.find({ published: false });
    for (const e of events) {
      // publish to Kafka / Redis stream
      e.published = true;
      await e.save();
    }
  }
}
