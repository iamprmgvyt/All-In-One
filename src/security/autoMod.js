// Made by prmgvyt
const logger = require('../utils/logger');
const config = require('../../config.json');

class AutoModEngine {
  constructor() {
    this.badWords = [
      'scam', 'free nitro', 'selfbot', 'raidbot', 'nigger', 'faggot', 'retard'
    ];
  }

  inspectMessage(message) {
    if (message.author.bot || !message.guild) return null;

    const content = message.content || '';
    const attachments = message.attachments;

    // 1. Caps Spam Check (>70%)
    if (content.length > 12) {
      const caps = content.replace(/[^A-Z]/g, '').length;
      const percent = (caps / content.length) * 100;
      if (percent >= config.security.autoMod.maxCapsPercent) {
        return { type: 'CAPS_SPAM', reason: `Excessive uppercase characters (${Math.round(percent)}%)` };
      }
    }

    // 2. Banned Words Check
    const lower = content.toLowerCase();
    for (const word of this.badWords) {
      if (lower.includes(word)) {
        return { type: 'BAD_WORD', reason: `Message contains prohibited word: "${word}"` };
      }
    }

    // 3. Discord Invite Link Check
    if (config.security.autoMod.blockInvites) {
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[a-zA-Z0-9]+/i;
      if (inviteRegex.test(content)) {
        return { type: 'INVITE_LINK', reason: 'Posting unauthorized server invite links' };
      }
    }

    // 4. Dangerous File Attachment Check (.exe, .bat, .scr, etc.)
    if (attachments && attachments.size > 0) {
      for (const [, att] of attachments) {
        const name = att.name.toLowerCase();
        for (const ext of config.security.autoMod.dangerousExtensions) {
          if (name.endsWith(ext)) {
            return { type: 'DANGEROUS_FILE', reason: `Attached executable file type: ${ext}` };
          }
        }
      }
    }

    return null;
  }

  async handleViolation(message, violation) {
    try {
      if (message.deletable) {
        await message.delete();
      }
      logger.security(`🛡️ AutoMod Action: Deleted message from ${message.author.tag} (${violation.reason})`);

      const warningMsg = await message.channel.send(
        `⚠️ **AutoMod Warning** for ${message.author}: ${violation.reason}.`
      );
      setTimeout(() => warningMsg.delete().catch(() => {}), 6000);
    } catch (err) {
      logger.error('AutoMod violation handler failed:', err);
    }
  }
}

module.exports = new AutoModEngine();
