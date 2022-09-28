import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { MANUAL_VERIFICATION_MODAL_ID } from '../commands/verify-user';
import generateVerificationModal from '../components/verificationForm';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Verify User')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const discordIdComponent = new TextInputBuilder()
      .setCustomId('discordId')
      .setLabel('What is your Discord ID?')
      .setRequired(true)
      .setPlaceholder('1234567890')
      .setValue(interaction.targetId)
      .setMinLength(10)
      .setMaxLength(20)
      .setStyle(TextInputStyle.Short);

    console.log(interaction.targetId);

    const modal = generateVerificationModal(
      'Manual Verification Form',
      MANUAL_VERIFICATION_MODAL_ID,
      false,
      [discordIdComponent],
    );

    try {
      await interaction.showModal(modal);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Something went wrong',
        ephemeral: true,
      });
    }
  },
};
