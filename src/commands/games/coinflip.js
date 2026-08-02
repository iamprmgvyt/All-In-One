// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Games',
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin (Heads or Tails)')
    .addStringOption(opt => opt.setName('choice').setDescription('Heads or Tails').addChoices(
      { name: 'Heads', value: 'heads' },
      { name: 'Tails', value: 'tails' }
    )),
  aliases: ['flip', 'cf'],

  async execute(ctx) {
    const choice = ctx.isSlash ? ctx.interaction.options.getString('choice') : ctx.args[0];
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
    const isWin = choice ? choice.toLowerCase() === outcome : null;

    const embed = new EmbedBuilder()
      .setColor(isWin ? '#10b981' : (isWin === false ? '#ef4444' : '#6366f1'))
      .setTitle('🪙 Coin Flip Result')
      .setDescription(`The coin landed on **${outcome.toUpperCase()}**! ${isWin !== null ? (isWin ? '🎉 You won!' : '❌ You lost!') : ''}`)
      .setFooter({ text: 'AIO Games Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
