// Made by prmgvyt
/**
 * Local AI Risk Classifier using Naive Bayes + TF-IDF (100% Local, 0% Cloud AI Dependent)
 */
class LocalAISecurityEngine {
  constructor() {
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
      "free robux generator download exe file run as administrator free crypto airdrop"
    ];

    const hamDataset = [
      "hello everyone how is the server doing today?",
      "can someone help me with this code error in javascript?",
      "let us play some music together in the voice channel",
      "what time is the gaming tournament scheduled for tonight?",
      "thanks for sharing the design guidelines document",
      "please check the update announcement in news channel"
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

  classify(text) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) return { isSpam: false, riskScore: 0, flags: [] };

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
      flags: [...new Set(flags)]
    };
  }
}

module.exports = new LocalAISecurityEngine();
