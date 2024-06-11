import { createQueue } from 'kue';

const jobdata = {
  phoneNumber: '0713958070',
  message: 'Hello there',
}
const queue = createQueue({ name: 'push_notification_code' });
const job = queue.create('push_notification_code', jobdata);

job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

job.on('failed', () => {
  console.log('Notification job failed')
});

job.on('complete', () => {
  console.log("Job completed");
});

job.save();
