// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot REST API & WebSocket latency'),
  aliases: ['latency', 'p'],

  async execute(ctx) {
    const wsPing = ctx.client.ws.ping;
    const start = Date.now();
    const replyMsg = await ctx.reply({ content: '🏓 Calculating latency...' });
    const apiPing = Date.now() - start;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('⚡ Latency Telemetry')
      .addFields(
        { name: 'WebSocket Ping', value: `\`${wsPing} ms\``, inline: true },
        { name: 'REST API Ping', value: `\`${apiPing} ms\``, inline: true }
      )
      .setFooter({ text: 'AIO Framework v3.0 | Made by prmgvyt' })
      .setTimestamp();

    if (ctx.isSlash) {
      await ctx.interaction.editReply({ content: null, embeds: [embed] });
    } else {
      await replyMsg.edit({ content: null, embeds: [embed] });
    }
  }
};
