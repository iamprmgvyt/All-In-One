// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GuildModel } = require('../../utils/database');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('honeypot')
    .setDescription('Check current Honeypot trap channel status')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  aliases: ['honeypotstatus'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const guildConfig = await GuildModel.findOne({ guildId: ctx.guild.id }).catch(() => null);
    const channelId = guildConfig?.honeypotChannelId;

    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle('🪤 Honeypot Trap Channel Status')
      .addFields(
        { name: 'Trap Channel', value: channelId ? `<#${channelId}>` : '❌ Not configured (Use `/setuphoneypot`)', inline: true },
        { name: 'Punishment', value: 'Auto-Ban Selfbots & Raiders', inline: true }
      )
      .setFooter({ text: 'AIO Honeypot Trap Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
