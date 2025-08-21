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
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('🔒 Lock channel'),
    
    async execute(interaction) {
        // Check if the user has the MANAGE_CHANNELS permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ You do not have permission to lock this channel!', ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            // Lock the channel by denying send messages permission to @everyone
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
            await interaction.reply(`🔒 The channel has been locked!`);
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.reply({ content: '❌ Failed to lock the channel. Please check my permissions.', ephemeral: true });
        }
    }
};

