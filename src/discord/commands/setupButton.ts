import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup-verify')
    .setDescription('Creates a verify button'),
  async execute(interaction: CommandInteraction) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('primary')
        .setLabel('Click to verify')
        .setStyle(ButtonStyle.Primary),
    );

    try {
      await interaction.channel?.send({ components: [row] });
      await interaction.reply({
        content: 'All done!',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
