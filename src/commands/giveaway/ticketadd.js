// Made by prmgvyt
const { SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketadd')
    .setDescription('Add a user to the current ticket channel')
    .addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true)),
  aliases: ['tadd'],

  async execute(ctx) {
    const user = ctx.isSlash ? ctx.interaction.options.getUser('user') : ctx.message.mentions.users.first();
    if (!user) return ctx.reply('❌ Please specify a user to add.');

    const success = await ticketManager.addUserToTicket(ctx.channel, user);
    if (!success && ctx.isSlash) {
      await ctx.reply({ content: '❌ Failed to add user to ticket.', ephemeral: true });
    }
  }
};
