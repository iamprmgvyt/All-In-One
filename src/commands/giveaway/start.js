// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('Start a real-time countdown giveaway')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('prize').setDescription('Prize title').setRequired(true))
    .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true))
    .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners')),
  aliases: ['giveawaystart', 'gcreate'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
      return ctx.reply({ content: '⛔ You do not have permission to manage giveaways.', ephemeral: true });
    }

    const prize = ctx.isSlash ? ctx.interaction.options.getString('prize') : ctx.args[0];
    const duration = ctx.isSlash ? ctx.interaction.options.getInteger('duration') : parseInt(ctx.args[1]) || 5;
    const winners = (ctx.isSlash ? ctx.interaction.options.getInteger('winners') : parseInt(ctx.args[2])) || 1;

    if (!prize) return ctx.reply('❌ Please specify a prize.');

    await giveawayManager.startGiveaway(ctx.channel, prize, duration, winners, ctx.user);

    if (ctx.isSlash) {
      await ctx.reply({ content: `✅ Giveaway for **${prize}** started successfully!`, ephemeral: true });
    }
  }
};
