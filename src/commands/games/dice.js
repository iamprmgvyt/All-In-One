// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Games & Fun',
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a 6-sided or custom-sided dice'),
  aliases: ['rolldice', 'roll'],

  async execute(ctx) {
    const roll = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🎲 Dice Roll Result')
      .setDescription(`You rolled a **${roll}**! 🎲`)
      .setFooter({ text: 'AIO Games Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
