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
    data:new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('🪙 Flip a coin'),
    async execute(interaction){
        const side = Math.random()<0.5?'Heads':'Tails';
        await interaction.reply(`🪙 You get: ${side}`);
    }
};