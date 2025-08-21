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
        .setName('kick')
        .setDescription('👢 Kick a user')
        .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason')),
    
    async execute(interaction) {
        // Check if the user has the KICK_MEMBERS permission
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: '❌ You do not have permission to kick members!', ephemeral: true });
        }

        const member = interaction.options.getMember('user'); // Get the user to be kicked
        const reason = interaction.options.getString('reason') || 'No reason provided'; // Default reason if none is given

        // Check if the member exists
        if (!member) {
            return interaction.reply({ content: '❌ User does not exist!', ephemeral: true });
        }

        // Attempt to kick the member
        try {
            await member.kick(reason); // Kick the member with the specified reason
            await interaction.reply(`✅ Kicked ${member.user.tag}\nReason: ${reason}`); // Confirm the action
        } catch {
            // Handle any errors during the kick operation
            await interaction.reply({ content: '❌ Cannot kick this member!', ephemeral: true });
        }
    }
};
