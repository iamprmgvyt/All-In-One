// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🧹 Bulk delete messages in the current text channel (1 - 100)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true)),
  aliases: ['purge', 'clean'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const errEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('⛔ Permission Denied')
        .setDescription('You do not have permission to manage messages.')
        .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [errEmbed], ephemeral: true });
    }

    const amount = ctx.isSlash ? ctx.interaction.options.getInteger('amount') : parseInt(ctx.args[0]) || 10;
    const limit = Math.min(Math.max(amount, 1), 100);

    try {
      const deleted = await ctx.channel.bulkDelete(limit, true);

      const embed = new EmbedBuilder()
        .setColor('#10b981')
        .setTitle('🧹 Channel Purge Complete')
        .setDescription(`Successfully purged **${deleted.size}** messages from <#${ctx.channel.id}>.`)
        .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' })
        .setTimestamp();

      const msg = await ctx.reply({ embeds: [embed] });
      setTimeout(() => {
        if (ctx.isSlash) ctx.interaction.deleteReply().catch(() => {});
        else msg.delete().catch(() => {});
      }, 4000);
    } catch (err) {
      const errEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('❌ Purge Failed')
        .setDescription('Failed to delete messages. Discord API prevents bulk deleting messages older than 14 days.')
        .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [errEmbed] });
    }
  }
};
