import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { getUser } from '../../db';

export const MANUAL_VERIFICATION_MODAL_ID = 'manualVerificationModal';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Info')
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction) {
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
