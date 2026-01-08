
import request from 'supertest';

describe('Jobs flow', () => {
  it('creates job and accepts bid', async () => {
    await request('http://localhost:3000')
      .post('/jobs')
      .send({ claimId: '1' })
      .expect(201);
  });
});
