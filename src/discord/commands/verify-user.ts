import {
  CommandInteraction,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import generateVerificationModal from '../components/verificationForm';

export const MANUAL_VERIFICATION_MODAL_ID = 'manualVerificationModal';

export default {
  data: new SlashCommandBuilder()
    .setName('verify-user')
    .setDescription('Manually verify a user'),
  async execute(interaction: CommandInteraction) {
    const discordIdComponent = new TextInputBuilder()
      .setCustomId('discordId')
      .setLabel('What is your Discord ID?')
      .setRequired(true)
      .setPlaceholder('1234567890')
      .setMinLength(10)
      .setMaxLength(20)
      .setStyle(TextInputStyle.Short);

    const modal = generateVerificationModal(
      'Manual Verification Form',
      MANUAL_VERIFICATION_MODAL_ID,
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
