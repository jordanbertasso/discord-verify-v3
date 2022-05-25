import {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  Modal,
  TextInputComponent,
  Permissions,
  CommandInteraction,
} from 'discord.js';
import * as jose from 'jose';
import { isVerified, logInteraction } from './util';
import config from '../config';
import pingCommand from './commands/ping';
import setupButton from './commands/setupButton';
import infoCommand from './commands/info';
import sendEmail from '../email';
import { addAttempt, attemptsForUser } from '../db';
import { SlashCommandBuilder } from '@discordjs/builders';

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

type TPermissionSlashCommand = {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: CommandInteraction) => Promise<void>;
  requiresAdmin: boolean;
};

// Add commands
const commands = new Collection<string, TPermissionSlashCommand>();
commands.set(pingCommand.data.name, pingCommand);
commands.set(setupButton.data.name, setupButton);
commands.set(infoCommand.data.name, infoCommand);

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

// Handle command interactions
client.on('interactionCreate', async (interaction) => {
  logInteraction(interaction);

  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  if (command.requiresAdmin) {
    if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
      interaction.reply('You are not authorized to use this command.');
      return;
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    try {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
});

// Handle button click interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // Check if the user is already verified
  const alreadyVerified = await isVerified(interaction.user.id);

  if (alreadyVerified) {
    // If the user is already verified, just show a message
    try {
      await interaction.reply({
        content: 'You are already verified!',
        ephemeral: true,
      });
      return;
    } catch (error) {
      console.error(error);
    }
  }

  const modal = new Modal()
    .setCustomId('myModal')
    .setTitle('Email')
    .addComponents();

  const emailComponent = new TextInputComponent()
    .setCustomId('emailInput')
    .setLabel("What's your student or staff email?")
    .setRequired(true)
    .setPlaceholder('first.last@students.mq.edu.au')
    .setMinLength('a.b@mq.edu.au'.length)
    .setMaxLength(200)
    .setStyle('SHORT');

  const firstActionRow =
    new MessageActionRow<TextInputComponent>().addComponents(emailComponent);

  modal.addComponents(firstActionRow);

  try {
    await interaction.showModal(modal);
  } catch (error) {
    console.error(error);
  }
});

// Handle modal submit interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  // Get the data entered by the user
  const email = interaction.fields.getTextInputValue('emailInput');

  const regex = /^[a-z]+\.[a-z0-9]+@(students\.mq\.edu\.au|mq\.edu\.au)$/;

  if (!regex.test(email)) {
    try {
      await interaction.reply({
        content: 'Please enter a staff or student email address.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  let jwt;
  try {
    jwt = await new jose.SignJWT({ email })
      .setSubject(interaction.user.id)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(Buffer.from(config.web.jwtSecret));
  } catch (error) {
    console.error(error);
    return;
  }

  // Check how many attempts there have been from this user in the last hour
  const numAttempts = await attemptsForUser(interaction.user.id, 1);

  if (numAttempts >= 3) {
    try {
      await interaction.reply({
        content:
          'You have attempted to verify too many times in the last hour. Please try again later.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  // Add attempt for user
  try {
    await addAttempt(email, interaction.user.id);
  } catch (error) {
    console.log(error);
    try {
      await interaction.reply({
        content:
          'There was an error sending the email. Please contact an admin if you see this.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
    return;
  }

  // Send user email
  try {
    console.log(
      `Sending email to ${email} for user ${interaction.member?.user.username} - ${interaction.member?.user.id}`,
    );

    await sendEmail(email, interaction.user.username, jwt);
  } catch (error) {
    console.error(error);

    try {
      await interaction.reply({
        content:
          'There was an error sending the email. Please contact an admin if you see this.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
    return;
  }

  // Reply to user
  try {
    await interaction.reply({
      content:
        'Please follow the link in the email sent to you to verify. Please note the email may take up to 30 minutes to arrive for staff.',
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
  }
});

export default client;
