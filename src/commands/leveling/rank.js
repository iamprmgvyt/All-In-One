// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderRankCard } = require('../../canvas/rankCard');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Leveling & XP',
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your current level, XP progress, and rank card')
    .addUserOption(opt => opt.setName('target').setDescription('User to view rank')),
  aliases: ['lvl', 'level'],

  async execute(ctx) {
    await ctx.deferReply();

    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: targetUser.id }).catch(() => null);
    const xp = userData ? userData.xp : 350;
    const level = userData ? userData.level : 3;

    const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 256 });
    const requiredXP = level * 250;

    const buffer = await renderRankCard({
      username: targetUser.username,
      avatarUrl,
      level,
      currentXP: xp,
      requiredXP,
      rank: 1
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'rank-card.png' });
    return ctx.reply({ files: [attachment] });
  }
};
