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
        .setName('ping')
        .setDescription('🏓 Check bot ping'),
    
    async execute(interaction) {
        // Create an embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Set the color of the embed
            .setTitle('🏓 Pong!')
            .setDescription(`Latency: **${interaction.client.ws.ping} ms**`)
            .setTimestamp(); // Optional: add a timestamp

        // Reply with the embed
        await interaction.reply({ embeds: [embed] });
    }
};

