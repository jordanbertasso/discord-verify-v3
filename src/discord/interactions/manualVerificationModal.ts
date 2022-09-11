import { ModalSubmitInteraction } from 'discord.js';
import { addVerifiedUserToDb } from '../../db';
import { verifyUserInDiscord } from '../util';

export default async function handleManualVerificationModal(
  interaction: ModalSubmitInteraction,
) {
  // Get the data entered by the user
  const discordId = interaction.fields.getTextInputValue('discordId');
  const fullName = interaction.fields.getTextInputValue('fullNameInput');
  const email = interaction.fields.getTextInputValue('emailInput');
  const mqID = interaction.fields.getTextInputValue('idInput');

  const fullNameRegex = /^\w+ \w+(?: \w+)*$/;
  const emailRegex =
    /^[a-z-]+\.[a-z]+[0-9]*@(students\.mq\.edu\.au|mq\.edu\.au)$/;
  const idRegex = /^(mq|MQ)?[0-9]{8,12}$/;

  if (!fullNameRegex.test(fullName)) {
    try {
      await interaction.reply({
        content: 'Please enter an alphanumeric full name.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  if (!emailRegex.test(email)) {
    try {
      await interaction.reply({
        content: 'Please enter a staff or student email address.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  if (!idRegex.test(mqID)) {
    try {
      await interaction.reply({
        content: 'Please enter a valid student or staff ID.',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  }

  const staffRegex = /^[a-z]+\.[a-z0-9]+@mq\.edu\.au$/;

  try {
    await addVerifiedUserToDb(
      discordId,
      email,
      mqID,
      fullName,
      staffRegex.test(email),
    );
  } catch (e) {
    console.error(e);
    return;
  }

  try {
    await verifyUserInDiscord(discordId);
  } catch (error) {
    console.error("Couldn't verify user in discord", error);
    return;
  }

  // Reply to user
  try {
    await interaction.reply({
      content: 'User verified.',
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
  }
}
