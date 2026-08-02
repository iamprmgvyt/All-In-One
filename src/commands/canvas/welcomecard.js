// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderWelcomeCard } = require('../../canvas/welcomeCard');

module.exports = {
  category: 'Local Canvas',
  data: new SlashCommandBuilder()
    .setName('welcomecard')
    .setDescription('Render 100% Local Glassmorphism Welcome Card (0% Cloud AI Dependent)')
    .addUserOption(opt => opt.setName('target').setDescription('Target user')),
  aliases: ['testwelcome', 'wcard'],

  async execute(ctx) {
    await ctx.deferReply();

    const user = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;
    const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 256 });

    const buffer = await renderWelcomeCard({
      username: user.username,
      discriminator: user.discriminator || '0000',
      avatarUrl,
      serverName: ctx.guild.name,
      memberCount: ctx.guild.memberCount
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'welcome-card.png' });
    return ctx.reply({ files: [attachment] });
  }
};
