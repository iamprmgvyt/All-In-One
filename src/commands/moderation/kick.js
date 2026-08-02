// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt => opt.setName('target').setDescription('The user to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for kicking')),
  aliases: ['kickmember'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return ctx.reply({ content: '⛔ You do not have permission to kick members.', ephemeral: true });
    }

    const targetUser = ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first();
    const reason = ctx.getOption('reason') || 'No reason provided';

    if (!targetUser) return ctx.reply('❌ Please specify a valid user to kick.');

    const targetMember = await ctx.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember || !targetMember.kickable) return ctx.reply('❌ Cannot kick this user.');

    await targetMember.kick(`[Kicked by ${ctx.user.tag}] ${reason}`);

    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle('👢 Member Kicked')
      .addFields(
        { name: 'User', value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
        { name: 'Moderator', value: ctx.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
