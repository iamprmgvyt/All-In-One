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
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claimticket')
        .setDescription('✅ Claim a support ticket (Support role only)'),

    async execute(interaction) {
        const supportRoleId = process.env.SUPPORT_ROLE_ID;

        // Check role
        if (!interaction.member.roles.cache.has(supportRoleId)) {
            return interaction.reply({
                content: "❌ You don't have permission to use this command.",
                ephemeral: true,
            });
        }

        // Make sure this command is used inside a ticket channel
        if (!interaction.channel || interaction.channel.parent?.name !== "Tickets") {
            return interaction.reply({
                content: "❌ This command can only be used inside a ticket channel.",
                ephemeral: true,
            });
        }

        // Claim the ticket
        await interaction.channel.send(
            `✅ Ticket has been claimed by ${interaction.user}.`
        );

        await interaction.reply({
            content: `You have successfully claimed this ticket.`,
            ephemeral: true,
        });
    },
};
