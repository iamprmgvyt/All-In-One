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
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('🛒 View shop'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🛒 Shop')
            .setDescription('1️⃣ XP Potion - 100 coins\n2️⃣ Coin Chest - 500 coins\n3️⃣ Special Item - 1000 coins') // List of items in the shop
            .setColor('Random'); // Set a random color for the embed
        
        await interaction.reply({ embeds: [embed] }); // Send the embed as a reply
    }
};

