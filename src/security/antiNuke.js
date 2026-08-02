// Made by prmgvyt
const { AuditLogEvent } = require('discord.js');
const logger = require('../utils/logger');
const config = require('../../config.json');

class AntiNukeEngine {
  constructor() {
    // Track actions per user per guild: userId -> { channelDeletes: [], roleDeletes: [], bans: [] }
    this.userTracker = new Map();
  }

  getUserRecord(guildId, userId) {
    const key = `${guildId}:${userId}`;
    if (!this.userTracker.has(key)) {
      this.userTracker.set(key, { channelDeletes: [], roleDeletes: [], bans: [] });
    }
    return this.userTracker.get(key);
  }

  cleanOldTimestamps(arr, timeWindowMs) {
    const now = Date.now();
    return arr.filter(ts => now - ts < timeWindowMs);
  }

  async trackAction(guild, executorId, actionType) {
    if (!executorId || executorId === guild.client.user.id || executorId === guild.ownerId) {
      return; // Skip bot self & server owner
    }

    const limits = config.security.antiNuke;
    const record = this.getUserRecord(guild.id, executorId);
    const now = Date.now();

    if (actionType === 'CHANNEL_DELETE') {
      record.channelDeletes = this.cleanOldTimestamps(record.channelDeletes, limits.timeWindowMs);
      record.channelDeletes.push(now);

      if (record.channelDeletes.length >= limits.maxChannelDelete) {
        await this.punishNuker(guild, executorId, 'Mass Channel Deletion');
      }
    } else if (actionType === 'ROLE_DELETE') {
      record.roleDeletes = this.cleanOldTimestamps(record.roleDeletes, limits.timeWindowMs);
      record.roleDeletes.push(now);

      if (record.roleDeletes.length >= limits.maxRoleDelete) {
        await this.punishNuker(guild, executorId, 'Mass Role Deletion');
      }
    } else if (actionType === 'MEMBER_BAN') {
      record.bans = this.cleanOldTimestamps(record.bans, limits.timeWindowMs);
      record.bans.push(now);

      if (record.bans.length >= limits.maxBan) {
        await this.punishNuker(guild, executorId, 'Mass Member Ban');
      }
    }
  }

  async punishNuker(guild, userId, reason) {
    logger.security(`🚨 ANTI-NUKE TRIGGERED in ${guild.name}! User ${userId} flagged for: ${reason}`);

    try {
      const member = await guild.members.fetch(userId).catch(() => null);
      if (member) {
        // Revoke all roles
        await member.roles.set([], `Anti-Nuke Triggered: ${reason}`).catch(err => {
          logger.error(`AntiNuke: Failed to strip roles from ${userId}`, err);
        });

        // Ban nuker
        await member.ban({ reason: `[ANTI-NUKE AUTOMATED BAN] ${reason}` }).catch(err => {
          logger.error(`AntiNuke: Failed to ban nuker ${userId}`, err);
        });

        logger.security(`✅ Successfully neutralized nuker ${userId} in ${guild.name}`);
      }
    } catch (err) {
      logger.error(`AntiNuke punish error:`, err);
    }
  }
}

module.exports = new AntiNukeEngine();
