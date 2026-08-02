// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Apply Lavalink high performance audio filters (Bassboost, Nightcore, 8D, EQ)')
    .addStringOption(opt => opt.setName('type').setDescription('Filter type').setRequired(true).addChoices(
      { name: 'Bassboost', value: 'bassboost' },
      { name: 'Nightcore', value: 'nightcore' },
      { name: '8D Surround', value: 'eightD' }
    ))
    .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true)),
  aliases: ['audiofilter', 'eq'],

  async execute(ctx) {
    const type = ctx.isSlash ? ctx.interaction.options.getString('type') : ctx.args[0];
    const enabled = ctx.isSlash ? ctx.interaction.options.getBoolean('enabled') : ctx.args[1] === 'on';

    if (!type) return ctx.reply('❌ Available filters: `bassboost`, `nightcore`, `eightD`.');

    const success = lavalinkEngine.setFilter(ctx.guild.id, type, enabled);
    if (!success) return ctx.reply('❌ Invalid audio filter selected.');

    const embed = new EmbedBuilder()
      .setColor('#a855f7')
      .setTitle('🎛️ Lavalink Audio Filter Updated')
      .addFields(
        { name: 'Filter Type', value: `\`${type}\``, inline: true },
        { name: 'State', value: enabled ? '✅ Enabled' : '❌ Disabled', inline: true }
      )
      .setFooter({ text: 'Lavalink Audio DSP Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
