// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketsetup')
    .setDescription('Post the interactive Ticket Panel with dropdown menu in a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post panel')),
  aliases: ['setuppanel', 'ticketpanel'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const channel = (ctx.isSlash ? ctx.interaction.options.getChannel('channel') : ctx.message.mentions.channels.first()) || ctx.channel;

    await ticketManager.sendTicketPanel(channel);

    if (ctx.isSlash) {
      await ctx.reply({ content: `✅ Ticket Panel successfully posted to <#${channel.id}>!`, ephemeral: true });
    }
  }
};
