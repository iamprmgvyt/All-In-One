const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const bannedFilePath = path.join(__dirname, '../data/bannedUsers.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from this server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to unban')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Only allow server admins or owner
        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');
        const guild = interaction.guild;

        // Read banned users
        const bannedUsers = JSON.parse(fs.readFileSync(bannedFilePath, 'utf8'));

        // Check if user is banned in this guild
        const banRecordIndex = bannedUsers.findIndex(b => b.userId === targetUser.id && b.guildId === guild.id);
        if (banRecordIndex === -1) {
            return interaction.reply({ content: '❌ This user is not banned in this server.', ephemeral: true });
        }

        try {
            // Unban the user from Discord server
            await guild.bans.remove(targetUser.id);

            // Remove from bannedUsers.json
            bannedUsers.splice(banRecordIndex, 1);
            fs.writeFileSync(bannedFilePath, JSON.stringify(bannedUsers, null, 2));

            // Send embed confirmation
            const embed = new EmbedBuilder()
                .setTitle('User Unbanned')
                .setDescription(`<@${targetUser.id}> has been unbanned.`)
                .setColor('Green');

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: '❌ Failed to unban user.', ephemeral: true });
        }
    }
};
