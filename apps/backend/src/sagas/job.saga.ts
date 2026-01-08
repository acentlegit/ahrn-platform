
export enum JobState {
  CREATED, BIDDING, ASSIGNED, IN_PROGRESS, DONE, FAILED
}

export class JobSaga {
  state = JobState.CREATED;

  on(event: string) {
    switch (event) {
      case 'BID_ACCEPTED':
        this.state = JobState.ASSIGNED;
        break;
      case 'JOB_STARTED':
        this.state = JobState.IN_PROGRESS;
        break;
      case 'JOB_FAILED':
        this.state = JobState.FAILED;
        break;
      case 'JOB_COMPLETED':
        this.state = JobState.DONE;
    }
  }
}
