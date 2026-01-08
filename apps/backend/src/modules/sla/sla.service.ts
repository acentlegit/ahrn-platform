
import { redis } from '../../infra/redis';

export class SlaService {
  start(jobId: string, minutes: number) {
    return redis.set(`sla:${jobId}`, 'ACTIVE', 'EX', minutes * 60);
  }
}
