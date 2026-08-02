// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');
const { renderMusicCard } = require('../../canvas/musicCard');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Display the currently playing music track card rendered via Local Canvas'),
  aliases: ['np', 'currentsong'],

  async execute(ctx) {
    const player = lavalinkEngine.getGuildPlayer(ctx.guild.id);
    const track = player.currentlyPlaying || { title: 'No Track Playing', artist: 'Unknown Artist', duration: '3:45' };

    await ctx.deferReply();

    const buffer = await renderMusicCard({
      title: track.title,
      artist: track.artist,
      albumArtUrl: null,
      currentTimeStr: '1:20',
      totalTimeStr: '3:45',
      progressPercent: 35
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'now-playing.png' });
    return ctx.reply({ files: [attachment] });
  }
};
