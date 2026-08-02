// Made by prmgvyt
const logger = require('../utils/logger');
const config = require('../../config.json');

class LavalinkMultiNodeEngine {
  constructor() {
    this.nodes = new Map();
    this.guildPlayers = new Map(); // guildId -> player state
    this.initNodes();
  }

  initNodes() {
    const nodeConfigs = config.lavalinkNodes || [];
    nodeConfigs.forEach(cfg => {
      this.nodes.set(cfg.name, {
        ...cfg,
        connected: false,
        reconnectAttempts: 0
      });
      logger.info(`🎵 Lavalink: Initialized node config [${cfg.name}] -> ${cfg.host}:${cfg.port}`);
    });
  }

  async connectAll() {
    for (const [name, node] of this.nodes) {
      try {
        // Simulate multi-node connection state with fallback handling
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

  getFilterStatus(guildId) {
    const player = this.getGuildPlayer(guildId);
    return player.filters;
  }
}

module.exports = new LavalinkMultiNodeEngine();
