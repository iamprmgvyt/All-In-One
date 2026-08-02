// Made by prmgvyt
const { EmbedBuilder } = require('discord.js');
const logger = require('./logger');

class GiveawayManager {
  constructor() {
    this.activeGiveaways = new Map(); // messageId -> giveawayData
  }

  async startGiveaway(channel, prize, durationMinutes, winnersCount = 1, hostUser) {
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle(`🎁 GIVEAWAY: ${prize}`)
      .setDescription(`React with 🎉 to enter!\n\n**Duration**: ${durationMinutes} minutes\n**Winners**: ${winnersCount}\n**Hosted By**: ${hostUser}`)
      .setFooter({ text: 'AIO Giveaway Manager | Made by prmgvyt' })
      .setTimestamp(expiresAt);

    const msg = await channel.send({ embeds: [embed] });
    await msg.react('🎉');

    const giveawayData = {
      messageId: msg.id,
      channelId: channel.id,
      guildId: channel.guild.id,
      prize,
      winnersCount,
      expiresAt,
      ended: false
    };

    this.activeGiveaways.set(msg.id, giveawayData);

    setTimeout(() => {
      this.endGiveaway(msg.id, channel.client);
    }, durationMinutes * 60 * 1000);

    return msg;
  }

  async endGiveaway(messageId, client) {
    const giveaway = this.activeGiveaways.get(messageId);
    if (!giveaway || giveaway.ended) return null;

    giveaway.ended = true;

    try {
      const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
      if (!channel) return null;

      const msg = await channel.messages.fetch(messageId).catch(() => null);
      if (!msg) return null;

      const reaction = msg.reactions.cache.get('🎉');
      const users = reaction ? await reaction.users.fetch() : null;

      const validUsers = users ? users.filter(u => !u.bot).map(u => u) : [];

      if (validUsers.length === 0) {
        const noWinnerEmbed = new EmbedBuilder()
          .setColor('#64748b')
          .setTitle(`🎁 GIVEAWAY ENDED: ${giveaway.prize}`)
          .setDescription('❌ Giveaway ended, but no valid participants entered!')
          .setTimestamp();
        await msg.edit({ embeds: [noWinnerEmbed] });
        return [];
      }

      // Pick random winners
      const winners = [];
      for (let i = 0; i < Math.min(giveaway.winnersCount, validUsers.length); i++) {
        const randomIndex = Math.floor(Math.random() * validUsers.length);
        winners.push(validUsers.splice(randomIndex, 1)[0]);
      }

      const winnerMentions = winners.map(w => `${w}`).join(', ');

      const endedEmbed = new EmbedBuilder()
        .setColor('#10b981')
        .setTitle(`🎉 GIVEAWAY ENDED: ${giveaway.prize}`)
        .setDescription(`**Winner(s)**: ${winnerMentions}\nCongratulations!`)
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' })
        .setTimestamp();

      await msg.edit({ embeds: [endedEmbed] });
      await channel.send(`🎉 Congratulations ${winnerMentions}! You won **${giveaway.prize}**!`);
      logger.info(`🎁 Giveaway ${messageId} ended. Winners: ${winners.map(w => w.tag).join(', ')}`);
      return winners;
    } catch (err) {
      logger.error(`Error ending giveaway ${messageId}:`, err);
      return null;
    }
  }
}

module.exports = new GiveawayManager();
