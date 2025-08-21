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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('📝 Show current bot version'),

    async execute(interaction) {
        const version = '1.0.0'; // <-- Set your bot version here
        await interaction.reply(`📝 Current bot version: **${version}**`);
    }
};
