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
        .setName('unlock')
        .setDescription('🔓 Unlock channel'),
    
    async execute(interaction) {
        // Check if the user has permission to manage channels
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return await interaction.reply({ content: '❌ You do not have permission to unlock this channel!', ephemeral: true });
        }

        const channel = interaction.channel;

        // Unlock the channel by allowing everyone to send messages
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
        
        await interaction.reply(`🔓 Channel has been unlocked!`);
    }
};
