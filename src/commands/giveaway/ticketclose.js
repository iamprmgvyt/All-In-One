// Made by prmgvyt
const { SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketclose')
    .setDescription('Close current ticket channel and generate transcript'),
  aliases: ['tclose', 'close'],

  async execute(ctx) {
    if (ctx.isSlash) await ctx.reply({ content: '🔒 Closing ticket...', ephemeral: true });
    await ticketManager.closeTicketChannel(ctx.channel, ctx.user);
  }
};
