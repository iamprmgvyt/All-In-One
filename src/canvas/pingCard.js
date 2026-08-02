// Made by prmgvyt
const { createCanvas } = require('@napi-rs/canvas');

async function renderPingCard({ apiPing, wsPing, dbPing }) {
  const width = 750;
  const height = 360;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, width, height);

  // Card outline & glass fill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(20, 20, width - 40, height - 40, 20);
  ctx.fill();
  ctx.stroke();

  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('⚡ AIO TELEMETRY & PING VISUALIZER', 50, 65);

  // Latency Badges
  const drawBadge = (x, y, label, value, color) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, 200, 80, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(label.toUpperCase(), x + 15, y + 30);

    ctx.fillStyle = color;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`${value} ms`, x + 15, y + 65);
  };

  drawBadge(50, 95, 'WebSocket Ping', wsPing, '#10b981');
  drawBadge(275, 95, 'REST API Ping', apiPing, '#3b82f6');
  drawBadge(500, 95, 'Database Ping', dbPing, '#a855f7');

  // Heartbeat Graph Visualizer
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('Live Heartbeat Graph (ms telemetry)', 50, 215);

  const graphX = 50;
  const graphY = 230;
  const graphWidth = 650;
  const graphHeight = 80;

  // Graph background grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let x = graphX; x <= graphX + graphWidth; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, graphY);
    ctx.lineTo(x, graphY + graphHeight);
    ctx.stroke();
  }

  // Simulated Heartbeat sine wave points
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.beginPath();

  const points = [];
  const totalPoints = 30;
  for (let i = 0; i <= totalPoints; i++) {
    const px = graphX + (i / totalPoints) * graphWidth;
    let py = graphY + graphHeight / 2 + Math.sin(i * 0.8) * 20;
    if (i % 6 === 0) py -= 30; // Heartbeat spike
    if (i % 6 === 1) py += 25;
    points.push({ x: px, y: py });
  }

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Glow line
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 8;
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

module.exports = { renderPingCard };
