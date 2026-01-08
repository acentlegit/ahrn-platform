
import http from 'k6/http';

export default function () {
  http.post('http://localhost:3000/jobs', JSON.stringify({ claimId: '1' }));
}
