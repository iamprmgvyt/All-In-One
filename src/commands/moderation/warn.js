// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a formal warning to a member with role hierarchy checks')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('target').setDescription('The user to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true)),
  aliases: ['warning'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return ctx.reply({ content: '⛔ You do not have permission to warn members.', ephemeral: true });
    }

    const targetUser = ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first();
    const reason = ctx.getOption('reason') || 'No reason provided';

    if (!targetUser) return ctx.reply('❌ Please specify a valid user to warn.');
    if (targetUser.id === ctx.user.id) return ctx.reply('❌ You cannot warn yourself.');
    if (targetUser.id === ctx.guild.ownerId) return ctx.reply('⛔ Cannot warn the Server Owner.');

    const targetMember = await ctx.guild.members.fetch(targetUser.id).catch(() => null);

    if (targetMember) {
      if (ctx.user.id !== ctx.guild.ownerId && targetMember.roles.highest.position >= ctx.member.roles.highest.position) {
        return ctx.reply(`⛔ **Permission Error**: You cannot warn **${targetUser.tag}** because they have a higher or equal role than you in the role hierarchy.`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle('⚠️ Formal Warning Issued')
      .addFields(
        { name: 'User', value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
        { name: 'Moderator', value: ctx.user.tag, inline: true },
        { name: 'Reason', value: reason }
      )
      .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' })
      .setTimestamp();

    try {
      await targetUser.send(`⚠️ You received a formal warning in **${ctx.guild.name}**: ${reason}`).catch(() => {});
    } catch (e) {}

    return ctx.reply({ embeds: [embed] });
  }
};
