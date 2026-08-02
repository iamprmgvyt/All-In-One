// Made by prmgvyt
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const fetch = require('node-fetch');
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

  // Render & Cloud Hosting Health Check Endpoints (HTTP 200 OK Probe)
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  app.get('/ping', (req, res) => {
    res.status(200).send('pong');
  });

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

  // Port configuration for Render / Koyeb / Railway / Local
  const port = process.env.PORT || process.env.DASHBOARD_PORT || config.dashboardPort || 3000;
  const host = '0.0.0.0'; // Bind to 0.0.0.0 for Cloud Container Compatibility

  server.listen(port, host, () => {
    logger.info(`🚀 Web Dashboard & Render Cloud Health Server live on ${host}:${port}`);
    logger.info(`🔗 Web Telemetry URL: http://localhost:${port}/dashboard.html`);
  });

  // 24/7 Keep-Alive Self-Ping Loop for Free Cloud Hosting (Render / Replit)
  const selfPingUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_PING_URL;
  if (selfPingUrl) {
    logger.info(`🔄 Initializing 24/7 Keep-Alive Self-Ping loop for: ${selfPingUrl}/healthz`);
    setInterval(() => {
      fetch(`${selfPingUrl}/healthz`)
        .then(() => logger.info('⚡ 24/7 Keep-Alive Self-Ping successful.'))
        .catch(err => logger.warn(`Keep-Alive Self-Ping failed: ${err.message}`));
    }, 5 * 60 * 1000); // Ping every 5 minutes
  }

  return { app, server, wss };
}

module.exports = { startDashboardServer };
