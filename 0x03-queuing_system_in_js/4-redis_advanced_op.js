import { createClient, print } from 'redis';

const client = createClient()
  .on('error', (error) => console.log(`Redis client not connected to the server: ${error}`))
  .on('connect', () => console.log('Redis client connected to the server'));

const holbertonSchools = {
  "Portland": 50,
  "Seattle": 80,
  "New York": 20,
  "Bogota": 20,
  "Cali": 40,
  "Paris": 2,
};

Object.keys(holbertonSchools).map((key, value) => {
  client.hset("HolbertonSchools", key, value, print);
});

client.hgetall("HolbertonSchools", (err, reply) => {
  if (err) console.log(err);
  console.log(reply);
});
