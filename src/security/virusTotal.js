// Made by prmgvyt
const fetch = require('node-fetch');
const logger = require('../utils/logger');

class VirusTotalInspector {
  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY || null;
  }

  async checkDomain(domain) {
    if (!this.apiKey || this.apiKey.includes('your_')) {
      logger.warn('VirusTotal API Key not configured. Skipping VT cloud API scan.');
      return { domain, maliciousCount: 0, totalScans: 0, status: 'SKIPPED_NO_KEY' };
    }

    try {
      const cleanDomain = domain.replace(/https?:\/\//, '').split('/')[0];
      const url = `https://www.virustotal.com/api/v3/domains/${cleanDomain}`;

      const res = await fetch(url, {
        headers: { 'x-apikey': this.apiKey }
      });

      if (!res.ok) {
        return { domain: cleanDomain, maliciousCount: 0, totalScans: 0, status: `HTTP_${res.status}` };
      }

      const json = await res.json();
      const stats = json.data?.attributes?.last_analysis_stats || {};

      return {
        domain: cleanDomain,
        maliciousCount: stats.malicious || 0,
        suspiciousCount: stats.suspicious || 0,
        totalScans: Object.values(stats).reduce((a, b) => a + b, 0),
        status: 'SUCCESS'
      };
    } catch (err) {
      logger.error(`VirusTotal lookup error for ${domain}:`, err);
      return { domain, maliciousCount: 0, totalScans: 0, status: 'ERROR' };
    }
  }
}

module.exports = new VirusTotalInspector();
