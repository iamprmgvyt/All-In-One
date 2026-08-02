// Made by prmgvyt
const { createCanvas, loadImage } = require('@napi-rs/canvas');

async function renderMusicCard({ title, artist, albumArtUrl, currentTimeStr, totalTimeStr, progressPercent }) {
  const width = 750;
  const height = 240;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#09090b');
  grad.addColorStop(1, '#18181b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Outer border & glass effect
  ctx.fillStyle = 'rgba(24, 24, 27, 0.7)';
  ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(20, 20, width - 40, height - 40, 20);
  ctx.fill();
  ctx.stroke();

  // Album Cover Image
  const artSize = 140;
  const artX = 45;
  const artY = (height - artSize) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(artX, artY, artSize, artSize, 14);
  ctx.clip();

  try {
    if (albumArtUrl) {
      const img = await loadImage(albumArtUrl);
      ctx.drawImage(img, artX, artY, artSize, artSize);
    } else {
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(artX, artY, artSize, artSize);
    }
  } catch (e) {
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(artX, artY, artSize, artSize);
  }
  ctx.restore();

  // Track Metadata
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  const truncatedTitle = title.length > 32 ? title.substring(0, 30) + '...' : title;
  ctx.fillText(truncatedTitle, 210, 75);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '18px sans-serif';
  const truncatedArtist = artist.length > 35 ? artist.substring(0, 33) + '...' : artist;
  ctx.fillText(`by ${truncatedArtist}`, 210, 105);

  // Audio Seekbar Progress Line
  const barX = 210;
  const barY = 150;
  const barW = 480;
  const barH = 8;

  // Background seekbar track
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 4);
  ctx.fill();

  // Filled seekbar
  const currentRatio = Math.min(Math.max(progressPercent / 100, 0), 1);
  const fillW = Math.max(currentRatio * barW, 10);

  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.roundRect(barX, barY, fillW, barH, 4);
  ctx.fill();

  // Playhead dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(barX + fillW, barY + barH / 2, 8, 0, Math.PI * 2);
  ctx.fill();

  // Duration Timestamps
  ctx.fillStyle = '#71717a';
  ctx.font = '14px sans-serif';
  ctx.fillText(currentTimeStr, 210, 180);
  ctx.fillText(totalTimeStr, 645, 180);

  return canvas.toBuffer('image/png');
}

module.exports = { renderMusicCard };
