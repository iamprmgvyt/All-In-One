// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { GuildModel } = require('../../utils/database');

module.exports = {
  category: 'Configuration',
  data: new SlashCommandBuilder()
    .setName('setupwelcome')
    .setDescription('Configure a welcome channel to send 100% Local Canvas Glassmorphism Welcome Cards')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel for welcome cards').setRequired(true)),
  aliases: ['welcomesetup'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const channel = ctx.isSlash ? ctx.interaction.options.getChannel('channel') : ctx.message.mentions.channels.first();
    if (!channel) return ctx.reply('❌ Please specify a valid channel.');

    await GuildModel.findOneAndUpdate(
      { guildId: ctx.guild.id },
      { welcomeChannelId: channel.id },
      { upsert: true, new: true }
    ).catch(() => {});

    return ctx.reply(`🎉 Welcome Channel set to <#${channel.id}>! New members will receive custom 100% Local Glassmorphism Welcome Cards rendered via Local Canvas Studio.`);
  }
};
