// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('🎲 Reroll winner for a completed giveaway')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message ID').setRequired(true)),
  aliases: ['giveawayreroll', 'groll'],

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
        .setTitle('🎲 How to Reroll a Giveaway Winner')
        .setDescription('Usage: `/greroll message_id:<Message_ID>` or `!greroll <Message_ID>`')
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [guideEmbed] });
    }

    const winner = await giveawayManager.rerollGiveaway(messageId, ctx.client);
    if (!winner) {
      const errEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('❌ Reroll Failed')
        .setDescription(`Could not reroll winner for giveaway ID \`${messageId}\`. No valid participants found.`)
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [errEmbed] });
    }

    const successEmbed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('🎉 Giveaway Rerolled')
      .setDescription(`New Winner for giveaway \`${messageId}\`: **${winner}**! Congratulations!`)
      .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [successEmbed] });
  }
};
