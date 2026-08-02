// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('End an active giveaway early')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true)),
  aliases: ['giveawayend'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
      return ctx.reply({ content: '⛔ You do not have permission to manage giveaways.', ephemeral: true });
    }

    const messageId = ctx.isSlash ? ctx.interaction.options.getString('message_id') : ctx.args[0];
    if (!messageId) return ctx.reply('❌ Please specify a giveaway message ID.');

    const winners = await giveawayManager.endGiveaway(messageId, ctx.client);
    if (!winners) return ctx.reply('❌ Could not find an active giveaway with that ID.');

    return ctx.reply(`🎉 Giveaway **${messageId}** ended early successfully!`);
  }
};
