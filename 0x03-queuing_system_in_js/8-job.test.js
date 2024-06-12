import { createQueue } from "kue";
import createPushNotificationsJobs from "./8-job";
import { expect } from "chai";

const queue = createQueue();

describe('createPushNotificationsJobs', () => {
  beforeEach(() => {
    queue.testMode.enter(true);
  });

  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs("hello world", queue))
      .to.throw('Jobs is not an array')
  });

  it('created 2 notification jobs', () => {
    expect(queue.testMode.jobs.length).to.equal(0);
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
  });
});
