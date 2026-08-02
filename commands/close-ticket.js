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
        .setName('close')
        .setDescription('🔒 Close ticket'),
    async execute(interaction) {
        // Check if the channel is a ticket channel
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: '❌ This is not a ticket!', ephemeral: true });
        }

        // Check if the user has permission to close the ticket
        const ticketCreatorId = interaction.channel.topic; // Assuming the ticket creator ID is stored in the channel topic
        if (interaction.user.id !== ticketCreatorId && !interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply({ content: '❌ You do not have permission to close this ticket!', ephemeral: true });
        }

        await interaction.reply('🔒 The ticket will close in 5 seconds...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
};
