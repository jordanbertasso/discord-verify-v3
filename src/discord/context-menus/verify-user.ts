import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

export const MANUAL_VERIFICATION_MODAL_ID = 'manualVerificationModal';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Verify User')
    .setType(ApplicationCommandType.User),
};
