// Made by prmgvyt
const { Collection } = require('discord.js');
const logger = require('./logger');

class InviteTrackerEngine {
  constructor() {
    this.guildInvites = new Collection(); // guildId -> Collection<code, Invite>
    this.userInviteStats = new Map(); // `${guildId}:${userId}` -> { invitesCount: number, invitedUsers: [] }
  }

  async initGuildInvites(guild) {
    try {
      if (guild.members.me.permissions.has('ManageGuild')) {
        const invites = await guild.invites.fetch();
        const codeMap = new Collection();
        invites.forEach(inv => codeMap.set(inv.code, inv.uses));
        this.guildInvites.set(guild.id, codeMap);
        logger.info(`📨 Cached ${invites.size} invites for guild: ${guild.name}`);
      }
    } catch (err) {
      logger.warn(`Could not fetch invites for guild ${guild.name}: ${err.message}`);
    }
  }

  async trackMemberJoin(member) {
    const guild = member.guild;
    const oldInvites = this.guildInvites.get(guild.id);
    if (!oldInvites) return null;

    try {
      const newInvites = await guild.invites.fetch();
      const usedInvite = newInvites.find(inv => {
        const prevUses = oldInvites.get(inv.code) || 0;
        return inv.uses > prevUses;
      });

      // Update cache
      const updatedCodeMap = new Collection();
      newInvites.forEach(inv => updatedCodeMap.set(inv.code, inv.uses));
      this.guildInvites.set(guild.id, updatedCodeMap);

      if (usedInvite && usedInvite.inviter) {
        const inviter = usedInvite.inviter;
        const key = `${guild.id}:${inviter.id}`;
        
        const stats = this.userInviteStats.get(key) || { invitesCount: 0, invitedUsers: [] };
        stats.invitesCount++;
        stats.invitedUsers.push({ userId: member.id, code: usedInvite.code, joinedAt: new Date() });
        this.userInviteStats.set(key, stats);

        logger.info(`📨 User ${member.user.tag} joined ${guild.name} invited by ${inviter.tag} (Code: ${usedInvite.code})`);
        return { inviter, code: usedInvite.code, totalInvites: stats.invitesCount };
      }
    } catch (err) {
      logger.error('Error tracking member join invite:', err);
    }
    return null;
  }

  getUserStats(guildId, userId) {
    const key = `${guildId}:${userId}`;
    return this.userInviteStats.get(key) || { invitesCount: 0, invitedUsers: [] };
  }
}

module.exports = new InviteTrackerEngine();
