// Made by prmgvyt
const { createCanvas, loadImage } = require('@napi-rs/canvas');

async function renderRankCard({ username, avatarUrl, level, currentXP, requiredXP, rank }) {
  const width = 800;
  const height = 250;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Outer Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(20, 20, width - 40, height - 40, 20);
  ctx.fill();
  ctx.stroke();

  // Avatar
  const avatarSize = 100;
  const avatarX = 50;
  const avatarY = (height - avatarSize) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();

  try {
    if (avatarUrl) {
      const img = await loadImage(avatarUrl);
      ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
    } else {
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
  } catch (e) {
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  }
  ctx.restore();

  // Avatar Ring
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 2, 0, Math.PI * 2);
  ctx.stroke();

  // Rank & Level Info
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(username, 180, 80);

  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`RANK #${rank}`, 580, 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`LEVEL ${level}`, 690, 80);

  // XP Progress Numbers
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText(`${currentXP} / ${requiredXP} XP`, 180, 125);

  // Progress Bar Container
  const barX = 180;
  const barY = 145;
  const barW = 570;
  const barH = 22;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 11);
  ctx.fill();

  // Filled Progress Bar
  const progressRatio = Math.min(currentXP / requiredXP, 1);
  const fillWidth = Math.max(progressRatio * barW, 20);

  const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  barGrad.addColorStop(0, '#a855f7');
  barGrad.addColorStop(1, '#ec4899');

  ctx.fillStyle = barGrad;
  ctx.beginPath();
  ctx.roundRect(barX, barY, fillWidth, barH, 11);
  ctx.fill();

  return canvas.toBuffer('image/png');
}

module.exports = { renderRankCard };
