// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('antinuke')
    .setDescription('View and check Anti-Nuke rate limiter configuration')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  aliases: ['antinukesettings'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const limits = config.security.antiNuke;

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('🚨 Anti-Nuke Security Configuration')
      .addFields(
        { name: 'Status', value: limits.enabled ? '✅ Active & Guarding' : '❌ Disabled', inline: true },
        { name: 'Max Channel Deletions', value: `\`${limits.maxChannelDelete}\` / 10s`, inline: true },
        { name: 'Max Role Deletions', value: `\`${limits.maxRoleDelete}\` / 10s`, inline: true },
        { name: 'Max Member Bans', value: `\`${limits.maxBan}\` / 10s`, inline: true }
      )
      .setFooter({ text: 'AIO Local AI Security Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
