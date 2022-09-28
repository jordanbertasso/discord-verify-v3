import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import info from './commands/info';
import search from './commands/search';
import deleteUser from './commands/delete';
import ping from './commands/ping';
import setupButton from './commands/setupButton';
import verifyUser from './commands/verify-user';
import verifyUserContextMenu from './context-menus/verify-user';
import infoUserContextMenu from './context-menus/info';
import sendHelpUserContextMenu from './context-menus/send-help';

if (process.env.CI !== 'true' && process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
  },
};

const commands = [
  ping,
  setupButton,
  info,
  search,
  deleteUser,
  verifyUser,
  verifyUserContextMenu,
  infoUserContextMenu,
  sendHelpUserContextMenu,
].map((command) => command.data.toJSON());

const rest = new REST({ version: '9' }).setToken(config.discord.token);

// DELETE commands
// rest
//   .get(
//     Routes.applicationGuildCommands(
//       config.discord.clientId,
//       config.discord.guildId,
//     ),
//   )
//   .then((data: any) => {
//     console.log(data);
//     for (const command of data) {
//       rest.delete(
//         Routes.applicationGuildCommand(
//           config.discord.clientId,
//           config.discord.guildId,
//           command.id,
//         ),
//       );
//     }
//   })
//   .catch(console.error);

rest
  .put(
    Routes.applicationGuildCommands(
      config.discord.clientId,
      config.discord.guildId,
    ),
    { body: commands },
  )
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
