// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('Reroll winner for a completed giveaway')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true)),
  aliases: ['giveawayreroll'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
      return ctx.reply({ content: '⛔ You do not have permission to manage giveaways.', ephemeral: true });
    }

    const messageId = ctx.isSlash ? ctx.interaction.options.getString('message_id') : ctx.args[0];
    if (!messageId) return ctx.reply('❌ Please specify a giveaway message ID.');

    const winner = await giveawayManager.rerollGiveaway(messageId, ctx.client);
    if (!winner) return ctx.reply('❌ Could not reroll winner for that giveaway ID.');

    return ctx.reply(`🎉 Giveaway **${messageId}** rerolled! Winner: ${winner}`);
  }
};
