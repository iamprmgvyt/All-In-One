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
        .setName('say')
        .setDescription('🗣️ Make the bot say something')
        .addStringOption(o => o.setName('message').setDescription('Content to send').setRequired(true)),
    
    async execute(interaction) {
        const msg = interaction.options.getString('message'); // Get the message from the user
        await interaction.reply({ content: '✅ Message sent!', ephemeral: true }); // Acknowledge the command
        await interaction.channel.send(msg); // Send the message to the channel
    }
};

