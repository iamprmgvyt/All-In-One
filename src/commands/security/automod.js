// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('View AutoMod active security filters (Caps, Invites, Dangerous files)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  aliases: ['automodsettings'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const automod = config.security.autoMod;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🛡️ AutoMod Engine Status')
      .addFields(
        { name: 'Max Caps Threshold', value: `\`>${automod.maxCapsPercent}%\``, inline: true },
        { name: 'Block Discord Invites', value: automod.blockInvites ? '✅ Enabled' : '❌ Disabled', inline: true },
        { name: 'Blocked File Extensions', value: automod.dangerousExtensions.map(e => `\`${e}\``).join(', '), inline: false }
      )
      .setFooter({ text: 'AIO Local Security Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
