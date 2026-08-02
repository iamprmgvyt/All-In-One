// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('🎉 End an active giveaway early and pick winners immediately')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true)),
  aliases: ['giveawayend', 'gstop'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
      const permEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('⛔ Permission Denied')
        .setDescription('You do not have permission to manage giveaways.')
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [permEmbed], ephemeral: true });
    }

    const messageId = ctx.isSlash ? ctx.interaction.options.getString('message_id') : ctx.args[0];
    if (!messageId) {
      const guideEmbed = new EmbedBuilder()
        .setColor('#6366f1')
        .setTitle('🎉 How to End a Giveaway Early')
        .setDescription('Usage: `/gend message_id:<Message_ID>` or `!gend <Message_ID>`')
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [guideEmbed] });
    }

    const winners = await giveawayManager.endGiveaway(messageId, ctx.client);
    if (!winners) {
      const errEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('❌ Giveaway Not Found')
        .setDescription(`Could not find an active giveaway with message ID \`${messageId}\`.`)
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [errEmbed] });
    }

    const successEmbed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('🎉 Giveaway Ended Early')
      .setDescription(`Successfully ended giveaway \`${messageId}\`! Winners have been selected.`)
      .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [successEmbed] });
  }
};
