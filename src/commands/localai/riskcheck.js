// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const aiSecurityEngine = require('../../security/aiSecurityEngine');

module.exports = {
  category: 'Local AI',
  data: new SlashCommandBuilder()
    .setName('riskcheck')
    .setDescription('Local AI Risk Classifier (Naive Bayes + TF-IDF, 100% Local, 0% Cloud AI Dependent)')
    .addStringOption(opt => opt.setName('text').setDescription('Text content to classify').setRequired(true)),
  aliases: ['airisk', 'bayescheck'],

  async execute(ctx) {
    const text = ctx.isSlash ? ctx.interaction.options.getString('text') : ctx.args.join(' ');
    if (!text) return ctx.reply('❌ Please provide text content to analyze.');

    const result = aiSecurityEngine.classify(text);

    const embed = new EmbedBuilder()
      .setColor(result.isSpam ? '#ef4444' : '#10b981')
      .setTitle('🧠 Local AI Naive Bayes Risk Classifier')
      .addFields(
        { name: 'Input Text', value: `\`${text.length > 100 ? text.substring(0, 97) + '...' : text}\`` },
        { name: 'Risk Score', value: `\`${result.riskScore}%\``, inline: true },
        { name: 'Classification', value: result.isSpam ? '🚨 HIGH RISK / SPAM' : '✅ SAFE CONTENT', inline: true }
      )
      .setFooter({ text: '100% Local AI Security Engine | Author: prmgvyt' })
      .setTimestamp();

    if (result.flags.length > 0) {
      embed.addFields({ name: 'TF-IDF Flagged Keywords', value: result.flags.map(f => `\`${f}\``).join(', ') });
    }

    return ctx.reply({ embeds: [embed] });
  }
};
