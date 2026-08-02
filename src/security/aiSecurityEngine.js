// Made by prmgvyt
const fetch = require('node-fetch');
const logger = require('../utils/logger');

/**
 * Hybrid AI Security Engine
 * - Groq AI API (`GROQ_API_KEY`)
 * - NVIDIA AI NIM API (`NVIDIA_API_KEY`)
 * - Self-trained Local Naive Bayes + TF-IDF Engine (Fallback)
 */
class HybridAISecurityEngine {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || null;
    this.nvidiaApiKey = process.env.NVIDIA_API_KEY || null;

    // Local Naive Bayes + TF-IDF Dataset
    this.vocabulary = new Set();
    this.idfMap = new Map();
    this.spamWordCounts = new Map();
    this.hamWordCounts = new Map();
    this.totalSpamDocs = 0;
    this.totalHamDocs = 0;

    this.trainInitialDataset();
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, ' URL_TOKEN ')
      .replace(/[^a-z0-9\s_]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  trainInitialDataset() {
    const spamDataset = [
      "free discord nitro claim now instant delivery steam gift card link click here",
      "free steam wallet keys giveaway click this link now get free nitro 100% real",
      "claim $100 steam gift card instantly click here fast trade offer selfbot raid",
      "boost server free nitro generator 2026 working no survey download execute script",
      "urgent verify account click link or get banned discord staff announcement admin",
      "free robux generator download exe file run as administrator free crypto airdrop",
      "tải hack game miễn phí link drive virus scam crack full chìa khóa"
    ];

    const hamDataset = [
      "hello everyone how is the server doing today?",
      "can someone help me with this code error in javascript?",
      "let us play some music together in the voice channel",
      "what time is the gaming tournament scheduled for tonight?",
      "thanks for sharing the design guidelines document",
      "chào mọi người hôm nay cùng chơi game nhé"
    ];

    spamDataset.forEach(text => this.train(text, true));
    hamDataset.forEach(text => this.train(text, false));
    this.calculateTFIDF();
  }

  train(text, isSpam) {
    const tokens = this.tokenize(text);
    if (isSpam) this.totalSpamDocs++;
    else this.totalHamDocs++;

    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach(token => {
      this.vocabulary.add(token);
      if (isSpam) {
        this.spamWordCounts.set(token, (this.spamWordCounts.get(token) || 0) + 1);
      } else {
        this.hamWordCounts.set(token, (this.hamWordCounts.get(token) || 0) + 1);
      }
    });
  }

  calculateTFIDF() {
    const totalDocs = this.totalSpamDocs + this.totalHamDocs;
    this.vocabulary.forEach(term => {
      const docFreq = (this.spamWordCounts.get(term) || 0) + (this.hamWordCounts.get(term) || 0);
      const idf = Math.log(totalDocs / (1 + docFreq));
      this.idfMap.set(term, idf);
    });
  }

  classifyLocal(text) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return { isSpam: false, riskScore: 0, flags: [], engine: 'LOCAL_BAYES' };

    let logSpamProb = Math.log(this.totalSpamDocs / (this.totalSpamDocs + this.totalHamDocs));
    let logHamProb = Math.log(this.totalHamDocs / (this.totalSpamDocs + this.totalHamDocs));
    const vocabSize = this.vocabulary.size;

    const flags = [];
    let tfIdfSpamScore = 0;

    tokens.forEach(token => {
      const idf = this.idfMap.get(token) || 1.0;
      const spamCount = this.spamWordCounts.get(token) || 0;
      const hamCount = this.hamWordCounts.get(token) || 0;

      logSpamProb += Math.log((spamCount + 1) / (this.totalSpamDocs + vocabSize));
      logHamProb += Math.log((hamCount + 1) / (this.totalHamDocs + vocabSize));

      if (spamCount > hamCount) {
        tfIdfSpamScore += idf;
        flags.push(token);
      }
    });

    const spamProb = 1 / (1 + Math.exp(logHamProb - logSpamProb));
    const riskScore = Math.min(Math.round(spamProb * 100 + tfIdfSpamScore * 5), 100);

    return {
      isSpam: riskScore >= 70,
      riskScore,
      flags: [...new Set(flags)],
      engine: 'LOCAL_BAYES'
    };
  }

  async classifyGroqAI(text) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a Discord AI AutoMod Security Inspector. Analyze text for spam, phishing, scam links, hate speech, or dangerous material. Respond strictly in JSON: {"isSpam": boolean, "riskScore": number (0-100), "reason": "short explanation"}'
            },
            { role: 'user', content: text }
          ],
          temperature: 0.1
        }),
        timeout: 4000
      });

      if (response.ok) {
        const json = await response.json();
        const contentStr = json.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(contentStr.substring(contentStr.indexOf('{'), contentStr.lastIndexOf('}') + 1));
        return {
          isSpam: parsed.isSpam || parsed.riskScore >= 70,
          riskScore: parsed.riskScore || (parsed.isSpam ? 90 : 10),
          flags: [parsed.reason || 'Groq AI Moderation Flag'],
          engine: 'GROQ_AI'
        };
      }
    } catch (e) {
      logger.warn(`Groq AI request failed, falling back to local engine: ${e.message}`);
    }
    return null;
  }

  async classifyNvidiaAI(text) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.nvidiaApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-70b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an AI Safety AutoMod Inspector. Respond strictly in JSON: {"isSpam": boolean, "riskScore": number (0-100), "reason": "explanation"}'
            },
            { role: 'user', content: text }
          ],
          temperature: 0.1
        }),
        timeout: 4000
      });

      if (response.ok) {
        const json = await response.json();
        const contentStr = json.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(contentStr.substring(contentStr.indexOf('{'), contentStr.lastIndexOf('}') + 1));
        return {
          isSpam: parsed.isSpam || parsed.riskScore >= 70,
          riskScore: parsed.riskScore || (parsed.isSpam ? 90 : 10),
          flags: [parsed.reason || 'NVIDIA AI NIM Flag'],
          engine: 'NVIDIA_AI'
        };
      }
    } catch (e) {
      logger.warn(`NVIDIA AI NIM request failed, falling back to local engine: ${e.message}`);
    }
    return null;
  }

  async classify(text) {
    // 1. Try Groq AI API if configured
    if (this.groqApiKey && !this.groqApiKey.includes('your_')) {
      const groqRes = await this.classifyGroqAI(text);
      if (groqRes) return groqRes;
    }

    // 2. Try NVIDIA AI NIM API if configured
    if (this.nvidiaApiKey && !this.nvidiaApiKey.includes('your_')) {
      const nvidiaRes = await this.classifyNvidiaAI(text);
      if (nvidiaRes) return nvidiaRes;
    }

    // 3. Fallback to 100% Self-Trained Local Naive Bayes + TF-IDF Engine
    return this.classifyLocal(text);
  }
}

module.exports = new HybridAISecurityEngine();
