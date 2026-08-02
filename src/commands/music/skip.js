// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lavalinkEngine = require('../../music/lavalinkEngine');

module.exports = {
  category: 'Music',
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏭️ Skip current playing track'),
  aliases: ['next', 's'],

  async execute(ctx) {
    const player = lavalinkEngine.getGuildPlayer(ctx.guild.id);
    if (!player.playing || player.queue.length === 0) {
      return ctx.reply('❌ No more tracks in queue to skip.');
    }

    const nextTrack = player.queue.shift();
    player.currentlyPlaying = nextTrack;

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('⏭️ Track Skipped')
      .setDescription(`Now Playing: **${nextTrack.title}**`)
      .setFooter({ text: 'Lavalink Multi-Node Engine | Made by prmgvyt' });

    return ctx.reply({ embeds: [embed] });
  }
};
