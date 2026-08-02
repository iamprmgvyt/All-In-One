// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display detailed information about a Discord user')
    .addUserOption(opt => opt.setName('target').setDescription('Target user')),
  aliases: ['whois', 'uinfo', 'user'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;
    const member = await ctx.guild.members.fetch(targetUser.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle(`👤 User Info: ${targetUser.tag}`)
      .setThumbnail(targetUser.displayAvatarURL({ extension: 'png', size: 256 }))
      .addFields(
        { name: 'User ID', value: `\`${targetUser.id}\``, inline: true },
        { name: 'Created Account', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
        { name: 'Highest Role', value: member ? `${member.roles.highest}` : 'None', inline: true }
      )
      .setFooter({ text: 'AIO Utility Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
