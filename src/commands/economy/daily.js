// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily currency reward ($500)'),
  aliases: ['dailyreward'],

  async execute(ctx) {
    let userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: ctx.user.id }).catch(() => null);
    
    if (!userData) {
      userData = new UserModel({ guildId: ctx.guild.id, userId: ctx.user.id, balance: 1000 });
    }

    const now = new Date();
    if (userData.dailyTimestamp) {
      const diffHours = (now - new Date(userData.dailyTimestamp)) / (1000 * 60 * 60);
      if (diffHours < 24) {
        const remainingHours = Math.ceil(24 - diffHours);
        return ctx.reply(`⏳ You already claimed your daily reward! Please wait **${remainingHours} hours**.`);
      }
    }

    userData.balance += 500;
    userData.dailyTimestamp = now;
    await userData.save().catch(() => {});

    const embed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You received **$500**! Your new balance is **$${userData.balance.toLocaleString()}**.`)
      .setFooter({ text: 'AIO Economy Engine | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
