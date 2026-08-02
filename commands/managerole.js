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
        .setName('managerole')
        .setDescription('Create or delete a role')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption(o => 
            o.setName('action')
                .setDescription('Create or Delete')
                .setRequired(true)
                .addChoices(
                    { name: 'Create', value: 'create' }, 
                    { name: 'Delete', value: 'delete' }
                )
        )
        .addStringOption(o => 
            o.setName('name')
                .setDescription('Role name')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        // Check if the user has the Manage Roles permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: '❌ You do not have permission to manage roles!', ephemeral: true });
        }

        const action = interaction.options.getString('action');
        const name = interaction.options.getString('name');

        try {
            if (action === 'create') {
                // Create the role with the specified name
                const role = await interaction.guild.roles.create({ name });
                await interaction.reply({ content: `✅ Role "${role.name}" created!`, ephemeral: true });
            } else if (action === 'delete') {
                // Find the role by name
                const role = interaction.guild.roles.cache.find(r => r.name === name);
                if (!role) {
                    return interaction.reply({ content: `❌ Role "${name}" not found.`, ephemeral: true });
                }
                // Delete the role
                await role.delete();
                await interaction.reply({ content: `✅ Role "${name}" deleted!`, ephemeral: true });
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            await interaction.reply({ content: `❌ Error: ${err.message}`, ephemeral: true });
        }
    }
};
