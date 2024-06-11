import { createClient, print } from 'redis';

const client = createClient()
  .on('error', (error) => console.log(`Redis client not connected to the server: ${error}`))
  .on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (error, reply) => {
    if (error) console.log("Error:", error);
    print(reply)
  });

}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (error, reply) => {
    if (error) console.log("Error:", error);
    console.log(reply)
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
