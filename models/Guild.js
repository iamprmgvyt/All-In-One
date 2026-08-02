import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '/' },
    language: { type: String, default: 'en' }
});

export default mongoose.model('Guild', guildSchema);