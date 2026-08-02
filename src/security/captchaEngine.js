// Made by prmgvyt
const { createCanvas } = require('@napi-rs/canvas');
const logger = require('../utils/logger');
const config = require('../../config.json');

class MultiModeCaptchaEngine {
  constructor() {
    this.sessions = new Map(); // userId -> { code, answer, type, retries, expiresAt }
  }

  generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateMathProblem() {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 10) + 2;
    const c = Math.floor(Math.random() * 15) + 1;
    const problemStr = `(${a} × ${b}) + ${c} = ?`;
    const answer = String(a * b + c);
    return { problemStr, answer };
  }

  async renderDistortedTextCaptcha(code) {
    const width = 350;
    const height = 120;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background noise
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Random noise lines
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = `rgba(${Math.random()*255}, ${Math.random()*255}, 255, 0.4)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Random noise dots
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Render Distorted Text with Sine Wave & Rotations
    ctx.font = 'bold 36px sans-serif';
    ctx.textBaseline = 'middle';

    const charSpacing = width / (code.length + 1);
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = (i + 1) * charSpacing - 10;
      const waveY = height / 2 + Math.sin(i * 1.2) * 15;
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, waveY);
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ec4899';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    return canvas.toBuffer('image/png');
  }

  async renderMathVisualCaptcha(problemStr) {
    const width = 380;
    const height = 130;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, width, height);

    // Glass box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(15, 15, width - 30, height - 30, 16);
    ctx.fill();
    ctx.stroke();

    // Noise dots
    for (let i = 0; i < 150; i++) {
      ctx.fillStyle = `rgba(168, 85, 247, ${Math.random() * 0.6})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // Text math
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SOLVE MATH CAPTCHA:', 35, 50);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(problemStr, 45, 95);

    return canvas.toBuffer('image/png');
  }

  async createSession(userId, mode = 'TEXT') {
    let answer = '';
    let buffer = null;

    if (mode === 'MATH') {
      const math = this.generateMathProblem();
      answer = math.answer;
      buffer = await this.renderMathVisualCaptcha(math.problemStr);
    } else {
      const code = this.generateRandomCode(6);
      answer = code;
      buffer = await this.renderDistortedTextCaptcha(code);
    }

    const session = {
      userId,
      answer: answer.trim().toUpperCase(),
      mode,
      retries: 0,
      maxRetries: config.security.captcha.maxRetries || 3,
      expiresAt: Date.now() + (config.security.captcha.timeoutSeconds || 180) * 1000,
      imageBuffer: buffer
    };

    this.sessions.set(userId, session);
    return session;
  }

  verifyAttempt(userId, userInput) {
    const session = this.sessions.get(userId);
    if (!session) return { success: false, reason: 'NO_SESSION' };

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(userId);
      return { success: false, reason: 'EXPIRED' };
    }

    const formattedInput = String(userInput).trim().toUpperCase();

    if (formattedInput === session.answer) {
      this.sessions.delete(userId);
      return { success: true, reason: 'MATCH' };
    } else {
      session.retries++;
      if (session.retries >= session.maxRetries) {
        this.sessions.delete(userId);
        return { success: false, reason: 'MAX_RETRIES_EXCEEDED' };
      }
      return { success: false, reason: 'WRONG_ANSWER', remainingRetries: session.maxRetries - session.retries };
    }
  }
}

module.exports = new MultiModeCaptchaEngine();
