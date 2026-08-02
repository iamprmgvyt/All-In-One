// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages in the channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages (1-100)').setRequired(true)),
  aliases: ['purge', 'clean'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return ctx.reply({ content: '⛔ You do not have permission to delete messages.', ephemeral: true });
    }

    const amount = ctx.isSlash ? ctx.interaction.options.getInteger('amount') : parseInt(ctx.args[0]) || 10;
    const limit = Math.min(Math.max(amount, 1), 100);

    try {
      const deleted = await ctx.channel.bulkDelete(limit, true);
      const msg = await ctx.reply(`🧹 Successfully deleted **${deleted.size}** messages.`);
      setTimeout(() => {
        if (ctx.isSlash) ctx.interaction.deleteReply().catch(() => {});
        else msg.delete().catch(() => {});
      }, 4000);
    } catch (err) {
      return ctx.reply('❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.');
    }
  }
};
