// 
// +---+---+---+
// | A | I | O |
// +---+---+---+
// +---+---+---+
// | B | Y |   |
// +---+---+---+
// +---+---+---+---+---+---+---+---+
// | P | R | M | G | V | Y | T |   |
// +---+---+---+---+---+---+---+---+
//
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define the path to the XP data file
const dataPath = path.join(__dirname, '../data/xp.json');

// Check if the XP data file exists; if not, create it
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '{}');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('🏆 XP leaderboard'),
    
    async execute(interaction) {
        // Read and parse the XP data from the JSON file
        const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        // Sort the entries by XP in descending order and get the top 10
        const arr = Object.entries(json).sort((a, b) => b[1] - a[1]).slice(0, 10);
        
        // Format the leaderboard text
        const text = arr.map((v, i) => `${i + 1}. <@${v[0]}>: ${v[1]} XP`).join('\n');
        
        // Send the leaderboard as a reply
        await interaction.reply(`🏆 XP Leaderboard:\n${text}`);
    }
};

