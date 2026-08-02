// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const virusTotal = require('../../security/virusTotal');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('vtcheck')
    .setDescription('Query VirusTotal v3 API for domain reputation')
    .addStringOption(opt => opt.setName('domain').setDescription('Domain name (e.g. example.com)').setRequired(true)),
  aliases: ['virustotal', 'vtscan'],

  async execute(ctx) {
    const domain = ctx.isSlash ? ctx.interaction.options.getString('domain') : ctx.args[0];
    if (!domain) return ctx.reply('❌ Please provide a domain name.');

    await ctx.deferReply();

    const res = await virusTotal.checkDomain(domain);

    const embed = new EmbedBuilder()
      .setColor(res.maliciousCount > 0 ? '#ef4444' : '#10b981')
      .setTitle(`🛡️ VirusTotal v3 API Domain Reputation`)
      .addFields(
        { name: 'Domain', value: `\`${res.domain}\``, inline: true },
        { name: 'Status', value: res.status, inline: true },
        { name: 'Malicious Scans', value: `${res.maliciousCount} / ${res.totalScans}`, inline: true }
      )
      .setFooter({ text: 'Powered by VirusTotal v3 API Integration | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
