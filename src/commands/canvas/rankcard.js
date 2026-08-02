// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderRankCard } = require('../../canvas/rankCard');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Local Canvas',
  data: new SlashCommandBuilder()
    .setName('rankcard')
    .setDescription('🎨 Render 100% Local XP Rank Card (0% Cloud AI Dependent)')
    .addUserOption(opt => opt.setName('target').setDescription('Target user')),
  aliases: ['rcard', 'canvasrank'],

  async execute(ctx) {
    await ctx.deferReply();

    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;
    const userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: targetUser.id }).catch(() => null);

    const xp = userData ? userData.xp : 450;
    const level = userData ? userData.level : 4;
    const requiredXP = level * 250;
    const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 256 });

    const buffer = await renderRankCard({
      username: targetUser.username,
      avatarUrl,
      level,
      currentXP: xp,
      requiredXP,
      rank: 1
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'local-rank-card.png' });
    return ctx.reply({ files: [attachment] });
  }
};
