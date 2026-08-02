// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock down a text channel to prevent members from sending messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to lock')),
  aliases: ['lockchannel'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return ctx.reply({ content: '⛔ You do not have permission to manage channels.', ephemeral: true });
    }

    const channel = (ctx.isSlash ? ctx.interaction.options.getChannel('channel') : ctx.message.mentions.channels.first()) || ctx.channel;

    try {
      await channel.permissionOverwrites.edit(ctx.guild.id, { SendMessages: false });

      const embed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('🔒 Channel Locked')
        .setDescription(`Channel <#${channel.id}> has been locked down by ${ctx.user}.`)
        .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' })
        .setTimestamp();

      return ctx.reply({ embeds: [embed] });
    } catch (err) {
      return ctx.reply(`❌ Failed to lock channel: ${err.message}`);
    }
  }
};
