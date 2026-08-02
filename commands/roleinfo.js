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
        .setName('roleinfo')
        .setDescription('Show info about a role.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Select a role')
                .setRequired(true)
        ),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        if (!role) {
            return interaction.reply({ content: '❌ Role not found.', ephemeral: true });
        }

        await interaction.reply({
            content:
                `📌 **Role Info**\n` +
                `Name: ${role.name}\n` +
                `ID: ${role.id}\n` +
                `Members: ${role.members.size}\n` +
                `Color: ${role.hexColor}\n` +
                `Created: ${role.createdAt.toDateString()}`,
            ephemeral: true
        });
    }
};