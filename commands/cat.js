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
const fetch = require('node-fetch');
module.exports = {
    data:new SlashCommandBuilder()
        .setName('cat')
        .setDescription('🐱 Random cat image'),
    async execute(interaction){
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const json = await res.json();
        await interaction.reply(json[0].url);
    }
};