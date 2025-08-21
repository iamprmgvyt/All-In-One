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
        .setName('pingrole')
        .setDescription('📣 Mention a role')
        .addRoleOption(o => o.setName('role').setDescription('Select role').setRequired(true)),
    
    async execute(interaction) {
        // Check if the user has permission to mention roles
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: '❌ You do not have permission to mention roles!', ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        await interaction.reply(`Here is the role: ${role}`);
    }
};
