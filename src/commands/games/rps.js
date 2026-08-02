// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Games & Fun',
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock, Paper, Scissors against the Bot')
    .addStringOption(opt => opt.setName('choice').setDescription('Rock, Paper, or Scissors').setRequired(true).addChoices(
      { name: 'Rock 🪨', value: 'rock' },
      { name: 'Paper 📄', value: 'paper' },
      { name: 'Scissors ✂️', value: 'scissors' }
    )),
  aliases: ['rockpaperscissors'],

  async execute(ctx) {
    const userChoice = ctx.isSlash ? ctx.interaction.options.getString('choice') : (ctx.args[0] || '').toLowerCase();
    if (!['rock', 'paper', 'scissors'].includes(userChoice)) {
      return ctx.reply('❌ Please choose `rock`, `paper`, or `scissors`.');
    }

    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = 'DRAW';
    if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = 'WIN';
    } else if (userChoice !== botChoice) {
      result = 'LOSE';
    }

    const embed = new EmbedBuilder()
      .setColor(result === 'WIN' ? '#10b981' : (result === 'LOSE' ? '#ef4444' : '#6366f1'))
      .setTitle('🎮 Rock, Paper, Scissors')
      .addFields(
        { name: 'Your Choice', value: `\`${userChoice.toUpperCase()}\``, inline: true },
        { name: 'Bot Choice', value: `\`${botChoice.toUpperCase()}\``, inline: true },
        { name: 'Outcome', value: result === 'WIN' ? '🎉 You Win!' : (result === 'LOSE' ? '❌ You Lost!' : '🤝 It\'s a Tie!'), inline: true }
      )
      .setFooter({ text: 'AIO Games Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
