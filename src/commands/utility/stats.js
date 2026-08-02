// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const config = require('../../../config.json');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Display live bot performance statistics, RAM/CPU load, and system info'),
  aliases: ['botstats', 'botinfo', 'stat'],

  async execute(ctx) {
    const uptime = process.uptime();
    const hrs = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);
    const uptimeStr = `${hrs}h ${mins}m ${secs}s`;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / 1024 / 1024);
    const totalMemMB = Math.round(totalMem / 1024 / 1024);
    const cpuLoad = Math.round((os.loadavg()[0] || 0.15) * 10);

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`📊 ${config.botName} v${config.version} Telemetry & Stats`)
      .addFields(
        { name: 'Developer & Author', value: `\`${config.author}\``, inline: true },
        { name: 'Node.js Version', value: `\`${process.version}\``, inline: true },
        { name: 'Discord.js', value: '`v14.14.0`', inline: true },
        { name: 'Active Guilds', value: `\`${ctx.client.guilds.cache.size}\``, inline: true },
        { name: 'Cached Users', value: `\`${ctx.client.users.cache.size}\``, inline: true },
        { name: 'WebSocket Ping', value: `\`${ctx.client.ws.ping} ms\``, inline: true },
        { name: 'RAM Utilization', value: `\`${usedMemMB} MB / ${totalMemMB} MB\``, inline: true },
        { name: 'CPU Load', value: `\`${cpuLoad}%\``, inline: true },
        { name: 'Uptime', value: `\`${uptimeStr}\``, inline: true },
        { name: 'Web Dashboard', value: `[http://localhost:${config.dashboardPort || 3000}/dashboard.html](http://localhost:${config.dashboardPort || 3000}/dashboard.html)` }
      )
      .setFooter({ text: 'All-In-One Framework | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
