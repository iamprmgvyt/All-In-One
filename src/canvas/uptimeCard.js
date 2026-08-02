// Made by prmgvyt
const { createCanvas } = require('@napi-rs/canvas');
const os = require('os');

async function renderUptimeCard({ uptimeString, serverCount, userCount, ramUsageMB, cpuLoadPercent }) {
  const width = 800;
  const height = 360;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Card outline
  ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(20, 20, width - 40, height - 40, 24);
  ctx.fill();
  ctx.stroke();

  // Header
  ctx.fillStyle = '#6366f1';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('📊 SYSTEM TELEMETRY & LIFETIME UPTIME', 50, 70);

  // Stat Boxes
  const drawStatBox = (x, y, w, h, label, value, sub, color) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(label.toUpperCase(), x + 15, y + 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(String(value), x + 15, y + 62);

    if (sub) {
      ctx.fillStyle = color;
      ctx.font = '12px sans-serif';
      ctx.fillText(sub, x + 15, y + 85);
    }
  };

  drawStatBox(50, 100, 220, 100, 'Lifetime Uptime', uptimeString, '100% Operational', '#10b981');
  drawStatBox(290, 100, 220, 100, 'RAM Load', `${ramUsageMB} MB`, `${Math.round((ramUsageMB / (os.totalmem() / 1024 / 1024)) * 100)}% Total Memory`, '#3b82f6');
  drawStatBox(530, 100, 220, 100, 'CPU Load', `${cpuLoadPercent}%`, `${os.cpus().length} Cores Active`, '#f59e0b');

  // Gauge Progress Bar for Memory
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Active Servers: ${serverCount} | Total Users Tracked: ${userCount}`, 50, 240);

  const barX = 50;
  const barY = 260;
  const barW = 700;
  const barH = 18;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 9);
  ctx.fill();

  const activeFill = (cpuLoadPercent / 100) * barW;
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(activeFill, 20), barH, 9);
  ctx.fill();

  // Footer branding
  ctx.fillStyle = '#64748b';
  ctx.font = '13px sans-serif';
  ctx.fillText('All-In-One (AIO) Discord Bot Framework v3.0 | Author: prmgvyt', 50, 315);

  return canvas.toBuffer('image/png');
}

module.exports = { renderUptimeCard };
