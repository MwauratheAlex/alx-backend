import { createQueue } from "kue";

const blacklistedPhoneNumbers = [ '4153518780', '4153518781' ]

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // start the job

  if (blacklistedPhoneNumbers.includes(phoneNumber)) {
    job.progress(100, 100);
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  setTimeout(() => {
    done();
  }, 1000);
}

const queue = createQueue();

queue.process('push_notification_code_2',2 , (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
  done();
});
