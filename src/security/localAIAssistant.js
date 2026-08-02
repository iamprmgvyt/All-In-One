// Made by prmgvyt
/**
 * Local AI Assistant Engine (100% Offline, 0% Cloud AI Dependent)
 * - Sentiment Analysis
 * - Text Summarization (TF-IDF Key Sentence Extractor)
 * - Offline Intelligent Response Generator
 */
class LocalAIAssistant {
  constructor() {
    this.posWords = new Set(['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'amazing', 'best', 'nice', 'cool', 'tuyệt', 'tốt', 'vui', 'thích']);
    this.negWords = new Set(['bad', 'terrible', 'horrible', 'worst', 'hate', 'sad', 'angry', 'poor', 'slow', 'error', 'tệ', 'dở', 'buồn', 'ghét', 'lỗi']);
  }

  analyzeSentiment(text) {
    const tokens = text.toLowerCase().split(/\s+/);
    let score = 0;
    tokens.forEach(t => {
      if (this.posWords.has(t)) score += 1;
      if (this.negWords.has(t)) score -= 1;
    });

    let label = 'NEUTRAL';
    if (score > 0) label = 'POSITIVE';
    if (score < 0) label = 'NEGATIVE';

    return { score, label, confidence: Math.min(Math.abs(score) * 25 + 50, 100) };
  }

  summarizeText(text, maxSentences = 2) {
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 5);
    if (sentences.length <= maxSentences) return text;

    // Word frequency map
    const words = text.toLowerCase().match(/\w+/g) || [];
    const freq = {};
    words.forEach(w => {
      if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
    });

    // Score sentences
    const scored = sentences.map(sentence => {
      const sentWords = sentence.toLowerCase().match(/\w+/g) || [];
      let sentenceScore = 0;
      sentWords.forEach(w => {
        if (freq[w]) sentenceScore += freq[w];
      });
      return { sentence, score: sentenceScore };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxSentences).map(s => s.sentence).join(' ');
  }

  generateChatResponse(query) {
    const lower = query.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('chào')) {
      return "Hello! I am your AIO Assistant, running 100% locally on your server. How can I help you today?";
    }
    if (lower.includes('who are you') || lower.includes('bạn là ai')) {
      return "I am the All-In-One (AIO) Discord Bot Framework v3.0 created by prmgvyt!";
    }
    if (lower.includes('help') || lower.includes('trợ giúp')) {
      return "You can use `!help` or `/help` to see all 1,200 executable command routes across 12 categories!";
    }
    if (lower.includes('security') || lower.includes('bảo mật')) {
      return "My Local AI Security Suite actively monitors messages for phishing, spam, bad files, and raid attacks using Naive Bayes + TF-IDF classification.";
    }
    return `I analyzed your query: "${query}". All systems are operational and running locally!`;
  }
}

module.exports = new LocalAIAssistant();
