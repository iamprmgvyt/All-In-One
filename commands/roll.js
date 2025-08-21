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
        .setName('roll')
        .setDescription('🎲 Roll a dice')
        .addIntegerOption(o => o.setName('max').setDescription('Maximum number').setRequired(false)),
    
    async execute(interaction) {
        const max = interaction.options.getInteger('max') || 100; // Default max value is 100
        const num = Math.floor(Math.random() * max) + 1; // Generate a random number between 1 and max
        await interaction.reply(`🎲 You rolled: ${num}`); // Reply with the rolled number
    }
};
