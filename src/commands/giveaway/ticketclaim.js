// Made by prmgvyt
const { SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketclaim')
    .setDescription('Claim current ticket for staff handling'),
  aliases: ['tclaim', 'claim'],

  async execute(ctx) {
    const res = await ticketManager.claimTicket(ctx.channel, ctx.user);
    if (!res.success) {
      if (res.reason === 'ALREADY_CLAIMED') {
        return ctx.reply(`❌ Ticket already claimed by <@${res.claimedBy}>.`);
      } else {
        return ctx.reply('❌ Current channel is not an active support ticket.');
      }
    }
  }
};
