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
        .setName('mute')
        .setDescription('🔇 Mute a user')
        .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true)),
    
    async execute(interaction) {
        // Check if the user has permission to mute members
        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply({ content: '❌ You do not have permission to mute members!', ephemeral: true });
        }

        const member = interaction.options.getMember('user');
        if (!member) return interaction.reply({ content: '❌ Cannot find user!', ephemeral: true });

        // Check if the member is already muted
        let muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) {
            muteRole = await interaction.guild.roles.create({ name: 'Muted', permissions: [] });
        }

        // Add the mute role to the member
        try {
            await member.roles.add(muteRole);
            await interaction.reply(`🔇 Muted ${member.user.tag}`);
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.reply({ content: `❌ Failed to mute ${member.user.tag}: ${error.message}`, ephemeral: true });
        }
    }
};

