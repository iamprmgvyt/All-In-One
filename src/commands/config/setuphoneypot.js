// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { GuildModel } = require('../../utils/database');

module.exports = {
  category: 'Configuration',
  data: new SlashCommandBuilder()
    .setName('setuphoneypot')
    .setDescription('Configure a trap channel to auto-ban selfbots and raid bots')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to use as honeypot trap').setRequired(true)),
  aliases: ['honeypotsetup', 'trapsetup'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const channel = ctx.isSlash ? ctx.interaction.options.getChannel('channel') : ctx.message.mentions.channels.first();
    if (!channel) return ctx.reply('❌ Please specify a valid channel.');

    await GuildModel.findOneAndUpdate(
      { guildId: ctx.guild.id },
      { honeypotChannelId: channel.id },
      { upsert: true, new: true }
    ).catch(() => {});

    return ctx.reply(`🪤 Honeypot trap channel configured successfully to: <#${channel.id}>. Anyone who posts in this channel will be auto-banned!`);
  }
};
