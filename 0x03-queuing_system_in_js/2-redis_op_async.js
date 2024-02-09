import { createClient, print } from "redis";
import { promisify } from 'util';

const client = createClient();

client.on('connect', () => {
  console.log("Redis client connected to the server")
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);      
})

const getAsync = promisify(client.get).bind(client);

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

async function displaySchoolValue(schoolName) {
  const value = await getAsync(schoolName);
  console.log(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
