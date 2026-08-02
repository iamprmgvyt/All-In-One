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
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('managecategory')
        .setDescription('Create or delete a category')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
                .setDescription('Category name')
                .setRequired(true)
        )
        .addStringOption(o => 
            o.setName('visibility')
                .setDescription('Public or Private')
                .setRequired(true)
                .addChoices(
                    { name: 'Public', value: 'public' }, 
                    { name: 'Private', value: 'private' }
                )
        ),
    
    async execute(interaction) {
        // Check if the user has the Manage Guild permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: '❌ You do not have permission to manage categories!', ephemeral: true });
        }

        const action = interaction.options.getString('action');
        const name = interaction.options.getString('name');
        const visibility = interaction.options.getString('visibility');

        try {
            if (action === 'create') {
                const overwrites = visibility === 'private' 
                    ? [{ id: interaction.guild.roles.everyone.id, deny: ['ViewChannel'] }] 
                    : [];
                
                // Create the category with specified permissions
                await interaction.guild.channels.create({
                    name,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: overwrites
                });
                await interaction.reply({ content: `✅ Category "${name}" created!`, ephemeral: true });

            } else if (action === 'delete') {
                // Find the category by name
                const cat = interaction.guild.channels.cache.find(c => c.name === name && c.type === ChannelType.GuildCategory);
                
                if (!cat) {
                    return interaction.reply({ content: `❌ Category "${name}" not found.`, ephemeral: true });
                }
                
                // Delete the category
                await cat.delete();
                await interaction.reply({ content: `✅ Category "${name}" deleted!`, ephemeral: true });
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            await interaction.reply({ content: `❌ Error: ${err.message}`, ephemeral: true });
        }
    }
};
