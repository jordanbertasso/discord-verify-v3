import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getUserByEmail } from '../../db';

export default {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('User by email')
    .addStringOption((option) =>
      option
        .setName('email')
        .setDescription('The email to search for')
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const email = interaction.options.getString('email');
    if (!email) {
      await interaction.reply({ content: 'Email not found', ephemeral: true });
      return;
    }

    const dbUser = await getUserByEmail(email);
    if (!dbUser) {
      await interaction.reply({
        content: 'Email not found in db',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: JSON.stringify(dbUser),
      ephemeral: true,
    });
  },
};
