import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    warns: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);