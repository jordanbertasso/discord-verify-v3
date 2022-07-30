import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup-verify')
    .setDescription('Creates a verify button'),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('primary')
        .setLabel('Click to verify')
        .setStyle('PRIMARY'),
    );

    try {
      await interaction.channel?.send({ components: [row] });
      await interaction.reply({ content: 'All done!', ephemeral: true });
    } catch (error) {
      console.error(error);
    }
  },
};
