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
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('😂 Get a random meme'),
    
    async execute(interaction) {
        try {
            const res = await fetch('https://meme-api.com/gimme');

            // Check if the response is OK
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const json = await res.json();
            // Check if the URL is present in the response
            if (json.url) {
                await interaction.reply(json.url);
            } else {
                await interaction.reply('❌ No meme found!');
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            await interaction.reply({ content: `❌ An error occurred: ${err.message}`, ephemeral: true });
        }
    }
};

