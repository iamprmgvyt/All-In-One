// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('⏸️ Pause or resume current Lavalink music playback'),
  aliases: ['resume'],

  async execute(ctx) {
    const player = lavalinkEngine.getGuildPlayer(ctx.guild.id);
    player.paused = !player.paused;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(player.paused ? '⏸️ Music Playback Paused' : '▶️ Music Playback Resumed')
      .setDescription(player.paused ? 'Playback is currently paused.' : 'Playback resumed successfully.')
      .setFooter({ text: 'Lavalink Multi-Node Engine | Made by prmgvyt' });

    return ctx.reply({ embeds: [embed] });
  }
};
