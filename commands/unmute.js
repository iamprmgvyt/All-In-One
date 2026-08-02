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
        .setName('unmute')
        .setDescription('🔊 Unmute a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to unmute')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        // Check if the user has permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command!',
                ephemeral: true
            });
        }

        const member = interaction.options.getMember('user');
        if (!member) {
            return interaction.reply({
                content: '❌ User not found!',
                ephemeral: true
            });
        }

        let muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
        if (muteRole && member.roles.cache.has(muteRole.id)) {
            await member.roles.remove(muteRole);
            return interaction.reply(`🔊 Successfully unmuted **${member.user.tag}**`);
        } else {
            return interaction.reply({
                content: `⚠️ ${member.user.tag} is not muted.`,
                ephemeral: true
            });
        }
    }
};
