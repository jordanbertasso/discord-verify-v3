import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Send Help Message')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setType(ApplicationCommandType.User),
  async execute(interaction: UserContextMenuCommandInteraction) {
    const user = interaction.targetUser;

    const dm = await user.createDM();

    try {
      await dm.send(
        `
      Hi there, it looks like you are having trouble verifying your account. Please follow the instructions below to verify your account:
      
      Send an email to macs.exec@gmail.com from **your student email** containing:
      - Your Discord username (including the #XXXX)
      - Your full name
      - Your Student ID

      If you have any questions, please contact a member of the exec team.
      `,
      );
      await interaction.reply({
        content: 'Help message sent',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Unable to send message',
        ephemeral: true,
      });
    }
  },
};
