// Made by prmgvyt
const { SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketremove')
    .setDescription('Remove a user from the current ticket channel')
    .addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true)),
  aliases: ['tremove'],

  async execute(ctx) {
    const user = ctx.isSlash ? ctx.interaction.options.getUser('user') : ctx.message.mentions.users.first();
    if (!user) return ctx.reply('❌ Please specify a user to remove.');

    const success = await ticketManager.removeUserFromTicket(ctx.channel, user);
    if (!success && ctx.isSlash) {
      await ctx.reply({ content: '❌ Failed to remove user from ticket.', ephemeral: true });
    }
  }
};
