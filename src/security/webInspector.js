// Made by prmgvyt
const fetch = require('node-fetch');
const logger = require('../utils/logger');

class RealUserWebInspector {
  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/122.0'
    ];
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async inspectUrl(targetUrl) {
    try {
      logger.info(`🔍 WebInspector: Inspecting target URL: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 5000
      });

      const html = await response.text();
      const finalUrl = response.url;

      // Phishing indicators regex pattern matching on DOM / HTML content
      const phishingPatterns = [
        /dlscord\./i,
        /discorcl\./i,
        /discocl\./i,
        /nitro-gift\./i,
        /free-nitro\./i,
        /steamcommumity\./i,
        /steamcommnunity\./i,
        /claim-gift/i,
        /login with discord/i,
        /authorize discord app/i,
        /steam wallet gift/i
      ];

      const detectedThreats = [];
      phishingPatterns.forEach(pattern => {
        if (pattern.test(html) || pattern.test(finalUrl)) {
          detectedThreats.push(pattern.toString());
        }
      });

      const isSuspicious = detectedThreats.length > 0 || finalUrl !== targetUrl;

      return {
        url: targetUrl,
        finalUrl,
        status: response.status,
        isSuspicious,
        detectedThreats,
        title: this.extractTitle(html)
      };
    } catch (err) {
      logger.warn(`WebInspector failed to reach ${targetUrl}: ${err.message}`);
      return {
        url: targetUrl,
        finalUrl: targetUrl,
        status: 0,
        isSuspicious: true,
        detectedThreats: ['Unreachable or blocked origin'],
        title: 'Error'
      };
    }
  }

  extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : 'No Title';
  }
}

module.exports = new RealUserWebInspector();
