// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderMusicCard } = require('../../canvas/musicCard');

module.exports = {
  category: 'Local Canvas',
  data: new SlashCommandBuilder()
    .setName('musiccard')
    .setDescription('🎨 Render 100% Local Now-Playing Music Player Graphic Card'),
  aliases: ['mcard', 'canvasmusic'],

  async execute(ctx) {
    await ctx.deferReply();

    const buffer = await renderMusicCard({
      title: 'AIO Cyberpunk Audio Track',
      artist: 'prmgvyt',
      albumArtUrl: null,
      currentTimeStr: '2:15',
      totalTimeStr: '4:00',
      progressPercent: 55
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'local-music-card.png' });
    return ctx.reply({ files: [attachment] });
  }
};
