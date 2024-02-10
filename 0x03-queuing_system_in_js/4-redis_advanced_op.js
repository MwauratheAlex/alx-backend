import { createClient, print } from 'redis';

const client = createClient();

client.on('connect', () => console.log('Redis client connected to server'));

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`)
});

const hsetKey = 'HolbertonSchools';

const hsetValues = {
  'Portland': 50,
  'Seattle': 80,
  'New York': 20,
  'Bogota': 20,
  'Cali': 40,
  'Paris': 2
};

for (let field of Object.keys(hsetValues)) {
  const value = hsetValues[field];
  client.hset(hsetKey, field, value, print);
}

client.hgetall(hsetKey, (err, value) => {
  if (err) {
    console.log(`Unable to fetch values: $err`);
    return;
  }
  console.log(value);
});
