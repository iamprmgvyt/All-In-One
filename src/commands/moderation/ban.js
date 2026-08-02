// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Moderation',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server with role hierarchy checks')
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

    if (targetUser.id === ctx.user.id) {
      return ctx.reply('❌ You cannot ban yourself.');
    }

    if (targetUser.id === ctx.guild.ownerId) {
      return ctx.reply('⛔ Cannot ban the Server Owner.');
    }

    const targetMember = await ctx.guild.members.fetch(targetUser.id).catch(() => null);
    const botMember = ctx.guild.members.me;

    if (targetMember) {
      // 1. Bot Role Hierarchy Check
      if (targetMember.roles.highest.position >= botMember.roles.highest.position) {
        return ctx.reply(
          `⛔ **Role Hierarchy Error**: Cannot ban **${targetUser.tag}** because their highest role (\`${targetMember.roles.highest.name}\`) is higher than or equal to the bot's highest role (\`${botMember.roles.highest.name}\`).\n\n` +
          `👉 **Solution**: Please move the bot's Role higher than **${targetMember.roles.highest.name}** in **Server Settings -> Roles**.`
        );
      }

      // 2. Moderator Role Hierarchy Check
      if (ctx.user.id !== ctx.guild.ownerId && targetMember.roles.highest.position >= ctx.member.roles.highest.position) {
        return ctx.reply(`⛔ **Permission Error**: You cannot ban **${targetUser.tag}** because they have a higher or equal role than you in the role hierarchy.`);
      }

      if (!targetMember.bannable) {
        return ctx.reply('❌ Discord system prevented banning this user due to administrator or hierarchy restrictions.');
      }
    }

    try {
      await ctx.guild.members.ban(targetUser.id, { reason: `[Banned by ${ctx.user.tag}] ${reason}` });

      const embed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('🔨 Member Banned')
        .addFields(
          { name: 'User', value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
          { name: 'Moderator', value: ctx.user.tag, inline: true },
          { name: 'Reason', value: reason }
        )
        .setFooter({ text: 'AIO Moderation Suite | Made by prmgvyt' })
        .setTimestamp();

      return ctx.reply({ embeds: [embed] });
    } catch (err) {
      return ctx.reply(`❌ Failed to ban user: ${err.message}`);
    }
  }
};
