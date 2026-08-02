// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display and download a user avatar in high resolution')
    .addUserOption(opt => opt.setName('target').setDescription('Target user')),
  aliases: ['av', 'pfp'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;
    const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 1024, dynamic: true });

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle(`🖼️ Avatar: ${targetUser.tag}`)
      .setImage(avatarUrl)
      .setDescription(`[Download High-Res PNG](${avatarUrl})`)
      .setFooter({ text: 'AIO Utility Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
