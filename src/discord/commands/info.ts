import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getUser } from '../../db';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('User info')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to get info for')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    if (!user) {
      await interaction.reply({ content: 'User not found', ephemeral: true });
      return;
    }

    const dbUser = await getUser(user.id);
    if (!dbUser) {
      await interaction.reply({
        content: 'User not found in db',
        ephemeral: true,
      });
      return;
    }

    if (!dbUser.email) {
      await interaction.reply({ content: 'No email found', ephemeral: true });
      return;
    }

    await interaction.reply({ content: dbUser?.email, ephemeral: true });
  },
};
