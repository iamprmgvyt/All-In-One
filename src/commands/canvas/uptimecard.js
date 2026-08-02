// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { renderUptimeCard } = require('../../canvas/uptimeCard');
const os = require('os');

module.exports = {
  category: 'Local Canvas',
  data: new SlashCommandBuilder()
    .setName('uptimecard')
    .setDescription('Render Local Canvas Uptime & System Load Telemetry Card'),
  aliases: ['ucard', 'statcard'],

  async execute(ctx) {
    await ctx.deferReply();

    const uptimeSeconds = process.uptime();
    const hrs = Math.floor(uptimeSeconds / 3600);
    const mins = Math.floor((uptimeSeconds % 3600) / 60);
    const secs = Math.floor(uptimeSeconds % 60);
    const uptimeString = `${hrs}h ${mins}m ${secs}s`;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramUsageMB = Math.round((totalMem - freeMem) / 1024 / 1024);
    const cpuLoadPercent = Math.round((os.loadavg()[0] || 0.15) * 10);

    const buffer = await renderUptimeCard({
      uptimeString,
      serverCount: ctx.client.guilds.cache.size || 1,
      userCount: ctx.client.users.cache.size || 10,
      ramUsageMB,
      cpuLoadPercent
    });

    const attachment = new AttachmentBuilder(buffer, { name: 'uptime-telemetry.png' });
    return ctx.reply({ files: [attachment] });
  }
};
