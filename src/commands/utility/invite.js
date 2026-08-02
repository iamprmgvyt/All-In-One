// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, OAuth2Scopes, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the official invite link to add All-In-One (AIO) Bot to your server'),
  aliases: ['invitebot', 'addbot', 'botinvite'],

  async execute(ctx) {
    const clientId = ctx.client.user.id;
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle('🤖 Invite All-In-One (AIO) Bot v3.0')
      .setDescription(`Click the button below to invite **${ctx.client.user.username}** to your Discord server with full Administrator permissions and Slash Command access!`)
      .addFields(
        { name: 'Developer & Author', value: 'prmgvyt', inline: true },
        { name: 'Version', value: 'v3.0.0', inline: true },
        { name: 'Features', value: 'Dual Route Commands, Local Canvas, Local AI Security, Lavalink Music, Dashboard', inline: false }
      )
      .setFooter({ text: 'All-In-One Framework | Made by prmgvyt' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🔗 Invite AIO Bot Now')
        .setStyle(ButtonStyle.Link)
        .setURL(inviteUrl)
    );

    return ctx.reply({ embeds: [embed], components: [row] });
  }
};
