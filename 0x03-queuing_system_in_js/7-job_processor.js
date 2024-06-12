import { Job, createQueue } from "kue";

const blacklistedPhones = ['4153518780', '4153518781'];

/**
  *
  * @param {Job} job 
  * @param {string} msg 
  * @param {string} phoneNumber 
  * @param {() => void} done 
  *
  */
function sendNotification(phoneNumber, msg, job, done) {
  job.progress(0, 100);

  if (blacklistedPhones.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber} with message: ${msg}`);

  done();
}

const queue = createQueue();
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
