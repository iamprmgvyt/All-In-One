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

require('dotenv').config(); // Load environment variables from .env file
const { SlashCommandBuilder } = require('@discordjs/builders'); // Import SlashCommandBuilder
const { Client, GatewayIntentBits } = require('discord.js'); // Import Client and GatewayIntentBits

const client = new Client({ intents: [GatewayIntentBits.Guilds] }); // Create a new client instance

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Send an invite link for the bot'),
    
    async execute(interaction) {
        const clientId = process.env.CLIENT_ID; // Retrieve client ID from environment variables
        const permissions = 40960; // Permissions integer (adjust as needed)
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissions}`;

        const inviteEmbed = {
            color: 0x0099ff,
            title: 'Invite Me to Your Server!',
            description: 'I would love to join your server and assist you with various tasks. Click the link below to invite me!',
            fields: [
                {
                    name: 'Why Invite Me?',
                    value: 'I can help with moderation, provide fun commands, and enhance your server experience!',
                },
                {
                    name: 'Permissions Needed',
                    value: 'I require the following permissions to function properly:\n- Send Messages\n- Embed Links\n- Attach Files\n- Manage Messages',
                },
                {
                    name: 'Support',
                    value: 'If you need help or have questions, feel free to reach out to my developer or check out the support server!',
                },
                {
                    name: 'Invite Link',
                    value: `[Click here to invite me!](${inviteLink})`, // Added invite link
                },
            ],
            footer: {
                text: 'Thank you for considering adding me!',
            },
        };

        await interaction.reply({ embeds: [inviteEmbed] });
    },
};
