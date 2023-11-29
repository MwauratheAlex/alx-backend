import { createClient, print } from "redis";

const client = createClient()

client.on('error', (err) => {
    console.log(`Error connecting: ${err}`);
})

client.on('connect', () => console.log("Connected to client"));

const hashKey = "HolbertonSchools";

const schools =  {
    "Portland": 50,
    "Seattle": 80,
    "New York": 20,
    "Bogota": 20,
    "Cali": 40,
    "Paris": 20
}

for (let school of Object.keys(schools)) {
    client.HSET(hashKey, school, schools[school], print);
}

client.HGETALL(hashKey, (err, values) => {
    err && console.log("Error occured: " + err);
    console.log(values);
})
