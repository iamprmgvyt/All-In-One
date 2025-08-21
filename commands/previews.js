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
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previews')
        .setDescription('🎛️ Preview the dashboard buttons'),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('main_commands')
                    .setLabel('Main Commands')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('utility_commands')
                    .setLabel('Utility Commands')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('moderation')
                    .setLabel('Moderation')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setURL('https://discord.gg/3xEVhbymk4') // Replace with your server
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.reply({
            content: '📊 **Bot Dashboard**\n**Welcome to the interactive dashboard preview**.**THOSE BUTTONS ARE NOT WORKING BECAUSE THEY ARE PREVIEW**',
            components: [row]
        });
    }
};
