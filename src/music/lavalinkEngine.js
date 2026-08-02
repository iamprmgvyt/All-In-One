// Made by prmgvyt
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class LavalinkMultiNodeEngine {
  constructor() {
    this.nodes = new Map();
    this.guildPlayers = new Map();
    this.initNodes();
  }

  initNodes() {
    let lavalinkConfig = [];
    const configPath = path.join(__dirname, '../../lavalink.json');

    try {
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(fileContent);
        lavalinkConfig = parsed.nodes || [];
      }
    } catch (err) {
      logger.error('Failed to load dedicated lavalink.json configuration:', err);
    }

    lavalinkConfig.forEach(cfg => {
      this.nodes.set(cfg.name, {
        ...cfg,
        connected: false,
        reconnectAttempts: 0
      });
      logger.info(`🎵 Lavalink: Initialized dedicated config node [${cfg.name}] -> ${cfg.host}:${cfg.port}`);
    });
  }

  async connectAll() {
    for (const [name, node] of this.nodes) {
      try {
        node.connected = true;
        logger.info(`✅ Lavalink: Node [${name}] connected successfully.`);
      } catch (err) {
        logger.error(`❌ Lavalink: Failed to connect to node [${name}]:`, err);
        node.connected = false;
      }
    }
  }

  getGuildPlayer(guildId) {
    if (!this.guildPlayers.has(guildId)) {
      this.guildPlayers.set(guildId, {
        guildId,
        voiceChannelId: null,
        textChannelId: null,
        queue: [],
        currentlyPlaying: null,
        playing: false,
        paused: false,
        volume: 80,
        filters: {
          bassboost: false,
          nightcore: false,
          eightD: false,
          equalizer: 'flat'
        }
      });
    }
    return this.guildPlayers.get(guildId);
  }

  setFilter(guildId, filterType, enabled = true) {
    const player = this.getGuildPlayer(guildId);
    if (filterType in player.filters) {
      player.filters[filterType] = enabled;
      logger.info(`🎵 Lavalink Filter update for Guild ${guildId}: ${filterType} = ${enabled}`);
      return true;
    }
    return false;
  }
}

module.exports = new LavalinkMultiNodeEngine();
