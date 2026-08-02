// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const webInspector = require('../../security/webInspector');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('inspect')
    .setDescription('Real-User Web Inspector: Scrape and check suspicious URLs for Steam/Nitro phishing')
    .addStringOption(opt => opt.setName('url').setDescription('Target URL to inspect').setRequired(true)),
  aliases: ['webinspect', 'urlcheck'],

  async execute(ctx) {
    const targetUrl = ctx.isSlash ? ctx.interaction.options.getString('url') : ctx.args[0];
    if (!targetUrl) return ctx.reply('❌ Please provide a valid URL to inspect.');

    await ctx.deferReply();

    const result = await webInspector.inspectUrl(targetUrl);

    const embed = new EmbedBuilder()
      .setColor(result.isSuspicious ? '#ef4444' : '#10b981')
      .setTitle(`🕵️ Real-User Web Inspector Results`)
      .addFields(
        { name: 'Target URL', value: `\`${result.url}\`` },
        { name: 'Final Resolved URL', value: `\`${result.finalUrl}\`` },
        { name: 'HTTP Status Code', value: String(result.status), inline: true },
        { name: 'Page Title', value: result.title, inline: true },
        { name: 'Threat Status', value: result.isSuspicious ? '🚨 HIGH RISK / PHISHING DETECTED' : '✅ SAFE / NO SUSPICIOUS DOM PATTERNS' }
      )
      .setFooter({ text: 'Powered by AIO Real-User Web Inspector | Made by prmgvyt' })
      .setTimestamp();

    if (result.detectedThreats.length > 0) {
      embed.addFields({ name: 'Detected Phishing Signatures', value: result.detectedThreats.join('\n') });
    }

    return ctx.reply({ embeds: [embed] });
  }
};
