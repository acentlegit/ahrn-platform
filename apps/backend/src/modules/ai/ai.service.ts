
import axios from 'axios';

export class AiService {
  async explainFailure(data: any) {
    const res = await axios.post('http://llama:8001/reason', {
      context: 'repair_outcome',
      data
    });
    return res.data;
  }
}
