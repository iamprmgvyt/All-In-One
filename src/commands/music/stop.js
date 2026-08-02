// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music playback and clear queue'),
  aliases: ['leave', 'destroy'],

  async execute(ctx) {
    const player = lavalinkEngine.getGuildPlayer(ctx.guild.id);
    player.queue = [];
    player.currentlyPlaying = null;
    player.playing = false;

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('⏹️ Music Playback Stopped')
      .setDescription('Queue cleared and music playback stopped.')
      .setFooter({ text: 'Lavalink Multi-Node Suite | Made by prmgvyt' });

    return ctx.reply({ embeds: [embed] });
  }
};
