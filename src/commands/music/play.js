// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song via Lavalink Multi-Node Music Engine')
    .addStringOption(opt => opt.setName('query').setDescription('Song title or URL').setRequired(true)),
  aliases: ['p', 'musicplay'],

  async execute(ctx) {
    const query = ctx.isSlash ? ctx.interaction.options.getString('query') : ctx.args.join(' ');
    if (!query) return ctx.reply('❌ Please provide a song query or link.');

    const voiceChannel = ctx.member.voice.channel;
    if (!voiceChannel) return ctx.reply('❌ You must be in a voice channel to play music.');

    const player = lavalinkEngine.getGuildPlayer(ctx.guild.id);
    player.voiceChannelId = voiceChannel.id;
    player.textChannelId = ctx.channel.id;

    const track = {
      title: query,
      artist: 'Unknown Artist',
      duration: '3:45',
      url: query
    };

    player.queue.push(track);
    if (!player.playing) {
      player.currentlyPlaying = track;
      player.playing = true;
    }

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('🎵 Song Added to Lavalink Queue')
      .addFields(
        { name: 'Track', value: `\`${track.title}\``, inline: true },
        { name: 'Voice Channel', value: `<#${voiceChannel.id}>`, inline: true }
      )
      .setFooter({ text: 'Lavalink Multi-Node Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
