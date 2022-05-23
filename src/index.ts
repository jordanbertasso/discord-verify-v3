import config from './config';
import connectToDB from './db';
import client from './discord';
import startWebServer from './http';

// Login to Discord with your client's token
console.log("Connecting to Discord");
client.login(config.discord.token);

console.log("Connecting to database");
connectToDB();

console.log("Starting web server");
startWebServer();


export default client;
