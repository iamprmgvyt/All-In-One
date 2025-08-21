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
        .setName('uptime')
        .setDescription('⏱️ Bot uptime'),
    async execute(interaction){
        const seconds = Math.floor(interaction.client.uptime/1000);
        const hours = Math.floor(seconds/3600);
        const minutes = Math.floor((seconds%3600)/60);
        const sec = seconds%60;
        await interaction.reply(`⏱️ Bot uptime: ${hours}h ${minutes}m ${sec}s`);
    }
};