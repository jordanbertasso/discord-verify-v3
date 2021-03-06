import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';
import info from './commands/info';
import ping from './commands/ping';
import setupButton from './commands/setupButton';

const commands = [ping, setupButton, info].map((command) =>
  command.data.toJSON(),
);

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
