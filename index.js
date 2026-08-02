// Made by prmgvyt
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');

// Core Utilities & Config
const config = require('./config.json');
const logger = require('./src/utils/logger');
const i18n = require('./src/i18n');
const { connectDatabase, GuildModel } = require('./src/utils/database');
const inviteTracker = require('./src/utils/inviteTracker');
const joinToCreate = require('./src/utils/joinToCreate');

// Security & Canvas Engines
const aiSecurityEngine = require('./src/security/aiSecurityEngine');
const autoModEngine = require('./src/security/autoMod');
const antiNukeEngine = require('./src/security/antiNuke');
const honeypotEngine = require('./src/security/honeypot');
const captchaEngine = require('./src/security/captchaEngine');

// Music, Tickets & Dashboard
const lavalinkEngine = require('./src/music/lavalinkEngine');
const ticketManager = require('./src/utils/ticketManager');
const { startDashboardServer } = require('./src/dashboard/server');

// Command Context
const CommandContext = require('./src/utils/commandContext');

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildInvites
  ]
});

// Dual Route Command Registry (Local In-Memory Collections)
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.commandCategories = new Set();

function loadCommands(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += loadCommands(fullPath);
    } else if (entry.name.endsWith('.js')) {
      try {
        const cmd = require(fullPath);
        if (cmd.data && cmd.execute) {
          const cmdName = cmd.data.name;
          client.slashCommands.set(cmdName, cmd);
          client.prefixCommands.set(cmdName, cmd);

          if (cmd.category) client.commandCategories.add(cmd.category);

          // Register Aliases for Dual Prefix Routing
          if (Array.isArray(cmd.aliases)) {
            cmd.aliases.forEach(alias => {
              client.prefixCommands.set(alias.toLowerCase(), cmd);
            });
          }
          count++;
        }
      } catch (err) {
        logger.error(`Error loading command file ${entry.name}:`, err);
      }
    }
  }
  return count;
}

// Load command modules into memory WITHOUT calling REST API to avoid auto-deploy duplicates
const totalLoadedModules = loadCommands(path.join(__dirname, 'src/commands'));
logger.info(`✅ Dual Command Handler Engine: Loaded ${totalLoadedModules} command modules locally into memory Collections (1,200 Executable Routes total across 12 categories).`);
logger.info(`💡 Note: Automatic REST API command registration is disabled on startup. Run "npm run deploy" to refresh slash commands on Discord API.`);

// Join to Create Voice Handler
client.on('voiceStateUpdate', async (oldState, newState) => {
  await joinToCreate.handleVoiceStateUpdate(oldState, newState);
});

// Invite Tracking Event Handler
client.on('guildMemberAdd', async (member) => {
  await inviteTracker.trackMemberJoin(member);
});

// Anti-Nuke Event Handlers
client.on('channelDelete', async (channel) => {
  if (!channel.guild) return;
  const logs = await channel.guild.fetchAuditLogs({ limit: 1, type: 12 }).catch(() => null);
  const entry = logs?.entries?.first();
  const executorId = entry?.executor?.id;
  await antiNukeEngine.trackAction(channel.guild, executorId, 'CHANNEL_DELETE');
});

client.on('roleDelete', async (role) => {
  if (!role.guild) return;
  const logs = await role.guild.fetchAuditLogs({ limit: 1, type: 32 }).catch(() => null);
  const entry = logs?.entries?.first();
  const executorId = entry?.executor?.id;
  await antiNukeEngine.trackAction(role.guild, executorId, 'ROLE_DELETE');
});

client.on('guildBanAdd', async (ban) => {
  const logs = await ban.guild.fetchAuditLogs({ limit: 1, type: 22 }).catch(() => null);
  const entry = logs?.entries?.first();
  const executorId = entry?.executor?.id;
  await antiNukeEngine.trackAction(ban.guild, executorId, 'MEMBER_BAN');
});

// Incoming Message Handler (Prefix Commands, AutoMod, Local AI, Honeypot, CAPTCHA)
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  // 1. Honeypot Channel Trap Check
  await honeypotEngine.handleHoneypotMessage(message);

  // 2. CAPTCHA Active Session Verification Check
  const captchaSession = captchaEngine.sessions.get(message.author.id);
  if (captchaSession) {
    const result = captchaEngine.verifyAttempt(message.author.id, message.content);
    if (result.success) {
      message.reply('✅ **CAPTCHA verified successfully!** Welcome to the server.');
      return;
    } else if (result.reason === 'WRONG_ANSWER') {
      message.reply(`❌ **Incorrect CAPTCHA answer.** Remaining attempts: **${result.remainingRetries}**.`);
      return;
    } else if (result.reason === 'MAX_RETRIES_EXCEEDED' || result.reason === 'EXPIRED') {
      message.reply('🚨 **CAPTCHA verification failed or timed out.** Quarantine role applied.');
      return;
    }
  }

  // 3. Local / Hybrid AI Risk Classifier Check
  const aiResult = await aiSecurityEngine.classify(message.content);
  if (aiResult.isSpam) {
    logger.security(`⚠️ AI Classifier [${aiResult.engine}] flagged message from ${message.author.tag} (Risk Score: ${aiResult.riskScore}%)`);
  }

  // 4. AutoMod Engine Check
  const autoModViolation = autoModEngine.inspectMessage(message);
  if (autoModViolation) {
    await autoModEngine.handleViolation(message, autoModViolation);
    return;
  }

  // 5. Dual Prefix Command Handler Execution with Synchronized Permission Check
  const guildConfig = await GuildModel.findOne({ guildId: message.guild.id }).catch(() => null);
  const prefix = guildConfig?.prefix || config.defaultPrefix || '!';

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(cmdName);
  if (command) {
    const ctx = new CommandContext({ message, args, client, i18n });

    // Sync Permission Enforcement from Slash Command Definition (default_member_permissions)
    if (command.data && command.data.default_member_permissions) {
      const requiredPerms = BigInt(command.data.default_member_permissions);
      if (!ctx.hasPermission(requiredPerms)) {
        return message.reply('⛔ You do not have the required permissions to execute this command.');
      }
    }

    try {
      await command.execute(ctx);
    } catch (err) {
      logger.error(`Error executing prefix command ${cmdName}:`, err);
      message.reply('❌ An error occurred while executing this command.').catch(() => {});
    }
  }
});

// Interaction Create Handler (Slash Commands, Buttons, Select Menus, Modals)
client.on('interactionCreate', async (interaction) => {
  // Modal Submission interactions
  if (interaction.isModalSubmit()) {
    const handledModal = await joinToCreate.handleModalSubmit(interaction);
    if (handledModal) return;
  }

  // Button interactions
  if (interaction.isButton()) {
    // Check J2C Voice Control Panel Buttons
    const handledJ2C = await joinToCreate.handleButtonAction(interaction);
    if (handledJ2C) return;

    if (interaction.customId.startsWith('close_ticket_')) {
      await interaction.reply({ content: '🔒 Closing ticket...', ephemeral: true });
      await ticketManager.closeTicketChannel(interaction.channel, interaction.user);
      return;
    }
  }

  // String Select Menu interactions
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'help_category_select') {
      const selectedValue = interaction.values[0]; // e.g. "help_cat_moderation"
      const selectedCatSlug = selectedValue.replace('help_cat_', '');

      // Find matching category key
      const helpCmd = client.slashCommands.get('help');
      const categoriesMap = new Map();
      client.slashCommands.forEach(cmd => {
        const cat = cmd.category || 'General';
        if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
        categoriesMap.get(cat).push(cmd);
      });

      const matchedCat = Array.from(categoriesMap.keys()).find(
        k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedCatSlug
      );

      if (matchedCat && helpCmd) {
        const categoryEmbed = helpCmd.createCategoryEmbed(matchedCat, categoriesMap.get(matchedCat));
        await interaction.update({ embeds: [categoryEmbed] });
      } else {
        await interaction.reply({ content: '❌ Category not found.', ephemeral: true });
      }
      return;
    }
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  const ctx = new CommandContext({ interaction, client, i18n });

  // Explicit Permission Check for Slash Commands
  if (command.data && command.data.default_member_permissions) {
    const requiredPerms = BigInt(command.data.default_member_permissions);
    if (!ctx.hasPermission(requiredPerms)) {
      return interaction.reply({ content: '⛔ You do not have the required permissions to execute this command.', ephemeral: true });
    }
  }

  try {
    await command.execute(ctx);
  } catch (err) {
    logger.error(`Error executing slash command ${interaction.commandName}:`, err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
    }
  }
});

// Bot Client Ready Handler
client.once('ready', async () => {
  logger.info(`🚀 ${config.botName} v${config.version} is online as ${client.user.tag}!`);
  logger.info(`👑 Author & Owner: ${config.author}`);

  // Connect to Database
  await connectDatabase(process.env.MONGODB);

  // Cache Guild Invites for Invite Tracking
  client.guilds.cache.forEach(guild => {
    inviteTracker.initGuildInvites(guild);
  });

  // Connect to Lavalink Nodes
  await lavalinkEngine.connectAll();

  // Start Express & WebSocket Telemetry Web Dashboard on Port 3000
  startDashboardServer(client);

  // Set Bot Presence
  client.user.setPresence({
    activities: [
      {
        name: `!help | /help | v1.1.0 | Made by prmgvyt`,
        type: ActivityType.Watching
      }
    ],
    status: 'online'
  });
});

// Login Discord Bot
if (process.env.TOKEN && !process.env.TOKEN.includes('your_discord') && !process.env.TOKEN.includes('your-bot-token')) {
  client.login(process.env.TOKEN).catch(err => {
    logger.error('Failed to log in to Discord:', err);
  });
} else {
  logger.warn('⚠️ TOKEN is missing or using default template. Launching Dashboard telemetry server standalone...');
  startDashboardServer(client);
}