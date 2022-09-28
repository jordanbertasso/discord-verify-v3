import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { getUser } from '../../db';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('User Info')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const userId = interaction.targetId;

    const dbUser = await getUser(userId);
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
