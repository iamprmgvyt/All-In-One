// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const localAIAssistant = require('../../security/localAIAssistant');

module.exports = {
  category: 'Local AI',
  data: new SlashCommandBuilder()
    .setName('aichat')
    .setDescription('Chat with Local AI Assistant Engine (100% Offline, 0% Cloud AI Dependent)')
    .addStringOption(opt => opt.setName('prompt').setDescription('Your message or question').setRequired(true)),
  aliases: ['askai', 'aiprompt'],

  async execute(ctx) {
    const prompt = ctx.isSlash ? ctx.interaction.options.getString('prompt') : ctx.args.join(' ');
    if (!prompt) return ctx.reply('❌ Please provide a prompt or question.');

    const response = localAIAssistant.generateChatResponse(prompt);

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🤖 Local AI Assistant Response')
      .addFields(
        { name: 'Query', value: `\`${prompt}\`` },
        { name: 'Response', value: response }
      )
      .setFooter({ text: '100% Offline Local AI Engine | Author: prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
