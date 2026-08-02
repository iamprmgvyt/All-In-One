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
        .setName('ban')
        .setDescription('⛔ Ban a user')
        .addUserOption(option => option.setName('user').setDescription('User').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason')),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason';

        // Check if the user has permission to ban members
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: '❌ You do not have permission to ban members.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: '❌ I cannot find this user', ephemeral: true });
        }

        try {
            await member.ban({ reason });
            await interaction.reply(`✅ Banned ${member.user.tag}\nReason: ${reason}`);
        } catch {
            await interaction.reply({ content: '❌ I cannot ban this user', ephemeral: true });
        }
    }
};
