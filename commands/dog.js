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
        .setName('dog')
        .setDescription('🐶 Random dog image'),
    async execute(interaction){
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const json = await res.json();
        await interaction.reply(json.message);
    }
};