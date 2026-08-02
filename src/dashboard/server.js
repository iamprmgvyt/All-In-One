// Made by prmgvyt
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const logger = require('../utils/logger');
const config = require('../../config.json');
const ticketManager = require('../utils/ticketManager');
const giveawayManager = require('../utils/giveawayManager');

function startDashboardServer(botClient) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  // Attach WebSocket server to Logger for live log streaming
  logger.setWSServer(wss);

  // Serve static UI files
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());

  // API Endpoints for Dashboard Telemetry
  app.get('/api/stats', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    res.json({
      botName: config.botName,
      author: config.author,
      version: config.version,
      uptime: process.uptime(),
      serverCount: botClient?.guilds?.cache?.size || 0,
      userCount: botClient?.users?.cache?.size || 0,
      ping: botClient?.ws?.ping || 0,
      activeTickets: ticketManager.activeTickets.size,
      activeGiveaways: giveawayManager.activeGiveaways.size,
      memory: {
        totalMB: Math.round(totalMem / 1024 / 1024),
        usedMB: Math.round(usedMem / 1024 / 1024),
        percent: Math.round((usedMem / totalMem) * 100)
      },
      cpuLoad: Math.round((os.loadavg()[0] || 0.15) * 10)
    });
  });

  // Serve dashboard.html
  app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });

  // Root redirect
  app.get('/', (req, res) => {
    res.redirect('/dashboard.html');
  });

  // WebSocket connection handler
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: '⚡ Connected to AIO Live Telemetry WebSocket Log Streamer'
    }));
  });

  const port = process.env.DASHBOARD_PORT || config.dashboardPort || 3000;
  server.listen(port, () => {
    logger.info(`🚀 Self-Hosted Web Dashboard & Telemetry live at http://localhost:${port}/dashboard.html`);
  });

  return { app, server, wss };
}

module.exports = { startDashboardServer };
