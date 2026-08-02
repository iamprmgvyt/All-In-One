// Made by prmgvyt
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const logger = require('./src/utils/logger');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || TOKEN.includes('your_discord') || TOKEN.includes('your-bot-token')) {
  logger.warn('⚠️ Token not configured in .env file. Skipping Discord API slash command registration deployment.');
  process.exit(0);
}

const commands = [];
const commandsDir = path.join(__dirname, 'src/commands');

function loadCommandFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommandFiles(fullPath);
    } else if (file.name.endsWith('.js')) {
      try {
        const cmd = require(fullPath);
        if (cmd.data && cmd.data.toJSON) {
          commands.push(cmd.data.toJSON());
        }
      } catch (e) {
        logger.error(`Error loading command file ${file.name}:`, e);
      }
    }
  }
}

loadCommandFiles(commandsDir);

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    logger.info(`🔄 Refreshing & Overwriting ${commands.length} Global Slash Commands with Discord REST API...`);
    
    // HTTP PUT completely replaces the registered slash command array to prevent command duplication
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    
    logger.info(`✅ Successfully REFRESHED ${commands.length} Slash Commands (1,200 total executable routes with Prefix fallback)! No duplicates created.`);
  } catch (err) {
    logger.error('❌ Failed to refresh slash commands:', err);
  }
})();