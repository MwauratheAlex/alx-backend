import createPushNotificationsJobs from "./8-job.js";
import { createQueue } from "kue";
import { expect } from "chai";


describe('createPushNotificationsJobs', () => {
  const queue = createQueue();
  
  before(() => {
    queue.testMode.enter(true);
  });

  after(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });


  it('displays an error message if jobs in not an array', () => {
    expect(() => createPushNotificationsJobs('hello', queue))
      .to.throw('Jobs is not an array');
  });

  it('creates 2 jobs to the queue', () => {
    expect(queue.testMode.jobs.length).to.equal(0);
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
  });
});
