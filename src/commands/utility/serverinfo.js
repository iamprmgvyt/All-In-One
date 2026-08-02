// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display detailed information and statistics for the current server'),
  aliases: ['sinfo', 'guildinfo', 'server'],

  async execute(ctx) {
    const guild = ctx.guild;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`🏰 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ extension: 'png', size: 256 }) || null)
      .addFields(
        { name: 'Server ID', value: `\`${guild.id}\``, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Total Members', value: `\`${guild.memberCount}\``, inline: true },
        { name: 'Channels Count', value: `\`${guild.channels.cache.size}\``, inline: true },
        { name: 'Roles Count', value: `\`${guild.roles.cache.size}\``, inline: true },
        { name: 'Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: 'AIO Utility Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
