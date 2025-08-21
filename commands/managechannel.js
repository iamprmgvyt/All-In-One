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
        .setName('managechannel')
        .setDescription('Create or delete a channel')
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
                .setDescription('Channel name')
                .setRequired(true)
        )
        .addStringOption(o => 
            o.setName('channel_type')
                .setDescription('Text or Voice')
                .setRequired(true)
                .addChoices(
                    { name: 'Text', value: 'text' }, 
                    { name: 'Voice', value: 'voice' }
                )
        )
        .addStringOption(o => 
            o.setName('visibility')
                .setDescription('Public or Private')
                .setRequired(true)
                .addChoices(
                    { name: 'Public', value: 'public' }, 
                    { name: 'Private', value: 'private' }
                )
        )
        .addChannelOption(o => 
            o.setName('category')
                .setDescription('Select a parent category for the channel')
                .addChannelTypes(ChannelType.GuildCategory) // Show only categories
        ),
    
    async execute(interaction) {
        // Check if the user has the Manage Guild permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: '❌ You do not have permission to manage channels!', ephemeral: true });
        }

        const action = interaction.options.getString('action');
        const name = interaction.options.getString('name');
        const channelType = interaction.options.getString('channel_type') === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText;
        const visibility = interaction.options.getString('visibility');
        const category = interaction.options.getChannel('category') || null; // Get the selected category

        try {
            if (action === 'create') {
                const overwrites = visibility === 'private' ? [{ id: interaction.guild.roles.everyone.id, deny: ['ViewChannel'] }] : [];
                
                // Create the channel with specified permissions
                await interaction.guild.channels.create({
                    name,
                    type: channelType,
                    parent: category ? category.id : null, // Set the parent to the selected category
                    permissionOverwrites: overwrites
                });
                await interaction.reply({ content: `✅ Channel "${name}" created!`, ephemeral: true });

            } else if (action === 'delete') {
                // Find the channel by name
                const ch = interaction.guild.channels.cache.find(c => c.name === name);
                
                if (!ch) {
                    return interaction.reply({ content: `❌ Channel "${name}" not found.`, ephemeral: true });
                }
                
                // Delete the channel
                await ch.delete();
                await interaction.reply({ content: `✅ Channel "${name}" deleted!`, ephemeral: true });
            }
        } catch (err) {
            console.error(err); // Log the error for debugging
            await interaction.reply({ content: `❌ Error: ${err.message}`, ephemeral: true });
        }
    }
};

