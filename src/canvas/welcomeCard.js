// Made by prmgvyt
const { createCanvas, loadImage } = require('@napi-rs/canvas');

async function renderWelcomeCard({ username, discriminator = '0000', avatarUrl, serverName, memberCount }) {
  const width = 800;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Neon Circles
  ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.beginPath();
  ctx.arc(100, 80, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
  ctx.beginPath();
  ctx.arc(700, 300, 180, 0, Math.PI * 2);
  ctx.fill();

  // Glassmorphism Card Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(40, 40, width - 80, height - 80, 24);
  ctx.fill();
  ctx.stroke();

  // Avatar Circle
  const avatarSize = 120;
  const avatarX = 80;
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
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
  } catch (e) {
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
  }
  ctx.restore();

  // Avatar Border Ring
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 2, 0, Math.PI * 2);
  ctx.stroke();

  // Text Content
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(`WELCOME TO ${serverName.toUpperCase()}`, 230, 120);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`${username}#${discriminator}`, 230, 165);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px sans-serif';
  ctx.fillText(`You are member #${memberCount}! Have fun here 🎉`, 230, 210);

  // Footer branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px sans-serif';
  ctx.fillText('Powered by AIO Framework v3.0 | Made by prmgvyt', 230, 260);

  return canvas.toBuffer('image/png');
}

module.exports = { renderWelcomeCard };
