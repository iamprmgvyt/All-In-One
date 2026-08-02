// Made by prmgvyt
const mongoose = require('mongoose');
const logger = require('./logger');

const GuildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  language: { type: String, default: 'en' },
  antiNuke: { type: Boolean, default: true },
  autoMod: { type: Boolean, default: true },
  honeypotChannelId: { type: String, default: null },
  welcomeChannelId: { type: String, default: null },
  verifiedRoleId: { type: String, default: null }
});

const UserXPCollection = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  balance: { type: Number, default: 1000 },
  dailyTimestamp: { type: Date, default: null }
});
UserXPCollection.index({ guildId: 1, userId: 1 }, { unique: true });

const GuildModel = mongoose.model('GuildConfig', GuildSchema);
const UserModel = mongoose.model('UserData', UserXPCollection);

async function connectDatabase(uri) {
  if (!uri || uri.includes('your-string')) {
    logger.warn('MongoDB URI not configured. Running database in mock/in-memory mode.');
    return false;
  }
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('✅ MongoDB connected successfully!');
    return true;
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    return false;
  }
}

module.exports = {
  connectDatabase,
  GuildModel,
  UserModel
};
