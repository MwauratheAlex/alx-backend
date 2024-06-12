import { createQueue } from "kue";
import { createClient, print } from "redis";
import { promisify } from 'util';

const express = require('express');

const client = createClient();
const seatsKey = 'available_seats';

function reserveSeat(number) {
  client.set(seatsKey, number, print);
}

reserveSeat(50);
let reservationEnabled = true;

const getAsync = promisify(client.get).bind(client);
async function getCurrentAvailableSeats() {
  const seats = parseInt(await getAsync(seatsKey));
  if (isNaN(seats)) return 0;
  return seats;
}

const queue = createQueue();

const app = express();
const port = 1245;

app.get('/available_seats', async (_, res) => {
  const available_seats = await getCurrentAvailableSeats();
  res.json({ "numberOfAvailableSeats": String(available_seats) });
});

app.get('/reserve_seat', (_, res) => {
  if (!reservationEnabled) {
    res.json({ "status": "Reservation are blocked" });
    return;
  }
  const job = queue.createJob('reserve_seat', {});

  job
    .on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err}`);
    })

  job.save((error) => {
    if (error) {
      res.json({ "status": "Reservation failed" });
    } else {
      res.json({ "status": "Reservation in process" });
    }
  });
});

app.get('/process', async (req, res) => {

  queue.process('reserve_seat', async (_, done) => {
    const available = await getCurrentAvailableSeats();
    const newAvailable = available - 1;
    if (newAvailable === 0) reservationEnabled = false;
    reserveSeat(newAvailable);

    if (newAvailable < 0) {
      done(new Error('Not enough seats available'));
      return;
    }
    done();
  });

  res.json({ "status": "Queue processing" });
});

app.listen(port, () => {
  console.log("Server running on port: " + port);
});
