const mongoose = require("mongoose");

const afkSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reason: { type: String, default: "No reason" },
    since: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Afk", afkSchema);
