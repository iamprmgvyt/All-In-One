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
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Show information about the bot.'),
    async execute(interaction) {
        const bot = interaction.client.user;
        const embed = new EmbedBuilder()
            .setTitle(`${bot.username} Info`)
            .setThumbnail(bot.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Bot Tag', value: bot.tag, inline: true },
                { name: 'Bot ID', value: bot.id, inline: true },
                { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: 'Discord.js', value: `v${require('discord.js').version}`, inline: true }
            )
            .setColor('Random')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
   