// Made by prmgvyt
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.wsServer = null;
    this.logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
    this.logFile = path.join(this.logsDir, 'combined.log');
  }

  setWSServer(wsServer) {
    this.wsServer = wsServer;
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  broadcast(formattedMsg, level) {
    if (this.wsServer && this.wsServer.clients) {
      const payload = JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message: formattedMsg
      });
      this.wsServer.clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(payload);
        }
      });
    }
  }

  logToFile(formattedMsg) {
    try {
      fs.appendFileSync(this.logFile, formattedMsg + '\n');
    } catch (err) {
      console.error('Failed to write log to file:', err);
    }
  }

  info(message) {
    const formatted = this.formatMessage('info', message);
    console.log(`\x1b[36m${formatted}\x1b[0m`);
    this.logToFile(formatted);
    this.broadcast(formatted, 'info');
  }

  warn(message) {
    const formatted = this.formatMessage('warn', message);
    console.warn(`\x1b[33m${formatted}\x1b[0m`);
    this.logToFile(formatted);
    this.broadcast(formatted, 'warn');
  }

  error(message, errorObj = null) {
    const fullMsg = errorObj ? `${message} - ${errorObj.stack || errorObj}` : message;
    const formatted = this.formatMessage('error', fullMsg);
    console.error(`\x1b[31m${formatted}\x1b[0m`);
    this.logToFile(formatted);
    this.broadcast(formatted, 'error');
  }

  security(message) {
    const formatted = this.formatMessage('security', message);
    console.log(`\x1b[35m${formatted}\x1b[0m`);
    this.logToFile(formatted);
    this.broadcast(formatted, 'security');
  }
}

module.exports = new Logger();
