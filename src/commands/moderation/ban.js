// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName('target').setDescription('The user to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban')),
  aliases: ['banmember', 'forceban'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return ctx.reply({ content: '⛔ You do not have permission to ban members.', ephemeral: true });
    }

    const targetUser = ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first();
    const reason = ctx.getOption('reason') || 'No reason provided';

    if (!targetUser) {
      return ctx.reply('❌ Please specify a valid user to ban.');
    }

    const targetMember = await ctx.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember || !targetMember.bannable) {
      return ctx.reply('❌ Cannot ban this user. They may have higher permissions than the bot.');
    }

    await targetMember.ban({ reason: `[Banned by ${ctx.user.tag}] ${reason}` });

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
        { name: 'Moderator', value: ctx.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
