// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('✨ Get the official invite link and web dashboard URL for All-In-One (AIO) Bot'),
  aliases: ['invitebot', 'addbot', 'botinvite'],

  async execute(ctx) {
    const clientId = ctx.client.user.id;
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('🤖 Invite All-In-One (AIO) Bot v1.1.0')
      .setDescription(`Click the buttons below to invite **${ctx.client.user.username}** to your Discord server or open the live Web Dashboard!`)
      .addFields(
        { name: '👑 Developer & Author', value: `\`${config.author}\``, inline: true },
        { name: '⚡ Framework Version', value: `\`v${config.version}\``, inline: true },
        { name: '🛡️ Core Engines', value: 'Dual Route Commands, Local Canvas, Local AI Security, Lavalink Music, Live Dashboard', inline: false }
      )
      .setThumbnail(ctx.client.user.displayAvatarURL({ extension: 'png', size: 256 }))
      .setFooter({ text: 'All-In-One Framework | Made by prmgvyt' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🔗 Invite AIO Bot Now')
        .setStyle(ButtonStyle.Link)
        .setURL(inviteUrl),
      new ButtonBuilder()
        .setLabel('🌐 Live Web Dashboard')
        .setStyle(ButtonStyle.Link)
        .setURL(`http://localhost:${config.dashboardPort || 3000}/dashboard.html`)
    );

    return ctx.reply({ embeds: [embed], components: [row] });
  }
};
