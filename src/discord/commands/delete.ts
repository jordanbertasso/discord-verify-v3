import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { deleteUser } from '../../db';

export default {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Delete a user from the database')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to delete')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    if (!user) {
      await interaction.reply({ content: 'User not found', ephemeral: true });
      return;
    }

    const dbUser = await deleteUser(user.id);

    if (!dbUser) {
      await interaction.reply({
        content: 'Failed to delete user from db',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: `Deleted user: ${JSON.stringify(dbUser)}`,
      ephemeral: true,
    });
  },
};
