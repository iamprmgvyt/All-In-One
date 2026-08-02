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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Show bot changelog.'),
    async execute(interaction) {
        try {
            // Load changelog.json from data folder
            const filePath = path.join(__dirname, '..', 'data', 'changelog.json');
            const changelog = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Format entries
            const formatted = changelog.entries.map(e => `- ${e}`).join('\n');

            await interaction.reply(`📝 **Changelog**:\n${formatted}`);
        } catch (error) {
            console.error("Failed to load changelog:", error);
            await interaction.reply("⚠️ Unable to load changelog right now.");
        }
    }
};
