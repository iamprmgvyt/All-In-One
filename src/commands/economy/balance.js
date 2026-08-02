// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('💰 Check user wallet & bank balance with interactive actions')
    .addUserOption(opt => opt.setName('target').setDescription('User to check')),
  aliases: ['bal', 'money', 'wallet'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: targetUser.id }).catch(() => null);
    const balance = userData ? userData.balance : 1000;

    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle(`💰 Balance Card: ${targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL({ extension: 'png', size: 256 }))
      .addFields(
        { name: '💵 Wallet Balance', value: `\`$${balance.toLocaleString()}\``, inline: true },
        { name: '🏦 Bank Deposit', value: '`$0`', inline: true },
        { name: '⭐ Level', value: `\`Level ${userData?.level || 1}\``, inline: true }
      )
      .setFooter({ text: 'AIO Economy Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
