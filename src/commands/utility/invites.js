// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const inviteTracker = require('../../utils/inviteTracker');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Check invite statistics and member tracking for a user')
    .addUserOption(opt => opt.setName('target').setDescription('User to check invite stats')),
  aliases: ['invitestats', 'myinvites'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const stats = inviteTracker.getUserStats(ctx.guild.id, targetUser.id);

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`📨 Invite Statistics: ${targetUser.username}`)
      .addFields(
        { name: 'Total Successful Invites', value: `\`${stats.invitesCount}\``, inline: true },
        { name: 'Tracked Members Invited', value: `\`${stats.invitedUsers.length}\``, inline: true }
      )
      .setFooter({ text: 'AIO Invite Tracking Engine | Made by prmgvyt' })
      .setTimestamp();

    if (stats.invitedUsers.length > 0) {
      const recentList = stats.invitedUsers.slice(-5).map(u => `<@${u.userId}> (Code: \`${u.code}\`)`).join('\n');
      embed.addFields({ name: 'Recent Invited Members', value: recentList });
    }

    return ctx.reply({ embeds: [embed] });
  }
};
