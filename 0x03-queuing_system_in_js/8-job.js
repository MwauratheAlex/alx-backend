/**
  * @param {{}[]} jobs 
  * @param {Queue} queue 
  */
function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error('Jobs is not an array');

  jobs.forEach((job) => {
    const nofificationJob = queue.createJob('push_notification_code_3', job);

    nofificationJob
      .on('enqueue', () => {
        console.log(`Notification job created: ${nofificationJob.id}`);
      })
      .on('complete', () => {
        console.log(`Notification job ${nofificationJob.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Notification job ${nofificationJob.id} failed: ${err}`);
      })
      .on('progress', (progress, _) => {
        console.log(`Notification job ${nofificationJob.id} ${progress}% complete`);
      });

    nofificationJob.save();
  });
}

export default createPushNotificationsJobs;
