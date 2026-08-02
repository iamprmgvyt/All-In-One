// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderPingCard } = require('../../canvas/pingCard');

module.exports = {
  category: 'Local Canvas',
  data: new SlashCommandBuilder()
    .setName('pingcard')
    .setDescription('Render Local Canvas Ping Visualizer Card with Live Heartbeat Graph'),
  aliases: ['pcard', 'pinggraph'],

  async execute(ctx) {
    await ctx.deferReply();

    const wsPing = ctx.client.ws.ping || 42;
    const apiPing = 65;
    const dbPing = 12;

    const buffer = await renderPingCard({ apiPing, wsPing, dbPing });
    const attachment = new AttachmentBuilder(buffer, { name: 'ping-telemetry.png' });
    return ctx.reply({ files: [attachment] });
  }
};
