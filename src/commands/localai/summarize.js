// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const localAIAssistant = require('../../security/localAIAssistant');

module.exports = {
  category: 'Local AI',
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('Local AI Paragraph Summarizer & Key Sentence Extractor')
    .addStringOption(opt => opt.setName('text').setDescription('Long text to summarize').setRequired(true)),
  aliases: ['summary', 'aisummary'],

  async execute(ctx) {
    const text = ctx.isSlash ? ctx.interaction.options.getString('text') : ctx.args.join(' ');
    if (!text) return ctx.reply('❌ Please provide text to summarize.');

    const summary = localAIAssistant.summarizeText(text, 2);
    const sentiment = localAIAssistant.analyzeSentiment(text);

    const embed = new EmbedBuilder()
      .setColor('#a855f7')
      .setTitle('📝 Local AI Text Summarizer')
      .addFields(
        { name: 'Original Length', value: `${text.length} characters`, inline: true },
        { name: 'Sentiment', value: `${sentiment.label} (${sentiment.score})`, inline: true },
        { name: 'Extracted Summary', value: `> ${summary}` }
      )
      .setFooter({ text: 'Local TF-IDF Extractor Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
