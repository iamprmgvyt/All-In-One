// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy',
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check user wallet & bank balance')
    .addUserOption(opt => opt.setName('target').setDescription('User to check')),
  aliases: ['bal', 'money', 'wallet'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: targetUser.id }).catch(() => null);
    const balance = userData ? userData.balance : 1000;

    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle(`💰 Balance of ${targetUser.username}`)
      .addFields(
        { name: 'Wallet Balance', value: `\`$${balance.toLocaleString()}\``, inline: true },
        { name: 'Bank Balance', value: '`$0`', inline: true }
      )
      .setFooter({ text: 'AIO Economy Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
