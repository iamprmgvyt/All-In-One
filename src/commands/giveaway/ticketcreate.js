// Made by prmgvyt
const { SlashCommandBuilder } = require('discord.js');
const ticketManager = require('../../utils/ticketManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('ticketcreate')
    .setDescription('Create a private support ticket channel')
    .addStringOption(opt => opt.setName('topic').setDescription('Subject or issue topic')),
  aliases: ['ticket', 'newticket'],

  async execute(ctx) {
    const topic = (ctx.isSlash ? ctx.interaction.options.getString('topic') : ctx.args.join(' ')) || 'General Support Inquiry';

    await ctx.deferReply(true);

    const channel = await ticketManager.createTicketChannel(ctx.guild, ctx.user, topic);

    if (ctx.isSlash) {
      await ctx.interaction.followUp({ content: `✅ Private support ticket created: <#${channel.id}>`, ephemeral: true });
    } else {
      await ctx.reply(`✅ Private support ticket created: <#${channel.id}>`);
    }
  }
};
