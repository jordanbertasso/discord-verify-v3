import loadConfig from './config';
import connectToDB from './db';
import client from './discord';
import startWebServer from './http';

const config = loadConfig();

// Login to Discord with your client's token
console.log('Connecting to Discord');
client.login(config.discord.token);

console.log('Connecting to database');
connectToDB(config.db.host, config.db.port, config.db.name, config.db.password);

console.log('Starting web server');
startWebServer();

export default client;
