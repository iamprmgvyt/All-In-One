// Made by prmgvyt
const logger = require('../utils/logger');
const { GuildModel } = require('../utils/database');

class HoneypotEngine {
  async handleHoneypotMessage(message) {
    if (!message.guild || message.author.bot) return;

    // Check if channel is configured as honeypot channel
    const guildConfig = await GuildModel.findOne({ guildId: message.guild.id }).catch(() => null);
    const honeypotChannelId = guildConfig?.honeypotChannelId;

    if (honeypotChannelId && message.channel.id === honeypotChannelId) {
      logger.security(`🪤 HONEYPOT TRAP TRIGGERED! User/Selfbot ${message.author.tag} (${message.author.id}) spoke in honeypot channel!`);

      try {
        if (message.deletable) await message.delete();

        const member = await message.guild.members.fetch(message.author.id).catch(() => null);
        if (member && member.bannable) {
          await member.ban({ reason: '🪤 Honeypot Trap Triggered: Auto-detected selfbot/raid bot activity.' });
          logger.security(`✅ Successfully banned raider/selfbot ${message.author.tag}`);
        }
      } catch (err) {
        logger.error(`Failed to execute honeypot punishment on ${message.author.id}:`, err);
      }
    }
  }
}

module.exports = new HoneypotEngine();
