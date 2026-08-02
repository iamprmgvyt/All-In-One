// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work a job shift to earn currency ($150 - $350)'),
  aliases: ['job'],

  async execute(ctx) {
    let userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: ctx.user.id }).catch(() => null);
    if (!userData) userData = new UserModel({ guildId: ctx.guild.id, userId: ctx.user.id, balance: 1000 });

    const jobs = ['Software Developer', 'Graphic Designer', 'Discord Moderator', 'Cybersecurity Analyst', 'Coffee Barista'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const earnings = Math.floor(Math.random() * 200) + 150;

    userData.balance += earnings;
    await userData.save().catch(() => {});

    const embed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('💼 Work Shift Complete')
      .setDescription(`You worked as a **${job}** and earned **$${earnings}**!\nNew Balance: **$${userData.balance.toLocaleString()}**`)
      .setFooter({ text: 'AIO Economy Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
