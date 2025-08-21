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
        .setName('inactive')
        .setDescription('Show inactive commands (manual list).'),

    async execute(interaction) {
        await interaction.reply({
            content: '❌ Currently no inactive commands.',
            ephemeral: true // chỉ người dùng nhìn thấy
        });
    }
};
   