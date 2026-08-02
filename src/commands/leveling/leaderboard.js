// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Leveling & XP',
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Display the top XP rankings for this server'),
  aliases: ['top', 'xptop', 'lb'],

  async execute(ctx) {
    const topUsers = await UserModel.find({ guildId: ctx.guild.id }).sort({ level: -1, xp: -1 }).limit(10).catch(() => []);

    const embed = new EmbedBuilder()
      .setColor('#a855f7')
      .setTitle(`🏆 XP Leaderboard: ${ctx.guild.name}`)
      .setFooter({ text: 'AIO Leveling Engine | Made by prmgvyt' })
      .setTimestamp();

    if (topUsers.length === 0) {
      embed.setDescription('No user XP data recorded yet. Start chatting to gain XP!');
    } else {
      let desc = '';
      topUsers.forEach((u, idx) => {
        const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `\`#${idx + 1}\``));
        desc += `${medal} <@${u.userId}> - **Level ${u.level}** (${u.xp} XP)\n`;
      });
      embed.setDescription(desc);
    }

    return ctx.reply({ embeds: [embed] });
  }
};
