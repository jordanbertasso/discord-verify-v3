# MACS Discord Verify

This Discord bot verifies student and staff Discord accounts by sending them an email.

## Usage

Copy `.env.example` to `.env` and fill in all of the fields.

Run with Docker Compose

```
docker-compose up
```

## Required Permissions

- View messages
- Send messages
- Manage roles

- The bot's role must be higher in the role hierarchy than the verify role

## Required Intents

- Server Members Intent
- Message Content Intent

## Development

### Adding a Command

1. Create a new file in `src/discord/commands/` (you can copy one of the existing commands as a template).
2. Populate the required fields, such as the commands name, description and logic.
3. If you want your command to be used by non administrators, set the `public` option to true on the command body
4. Add the command to the list in `src/discord/deploy-commands.ts`
5. Add the command to the list in `src/discord/index.ts`
6. Deploy the commands with `yarn deploy-commands`
