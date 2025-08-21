const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botcode')
        .setDescription('📂 Show the GitHub repo of this bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot AIO - Source Code')
            .setDescription('You can view and contribute to the source code here:')
            .addFields(
                { name: '📌 Repository', value: '[GitHub Repo](https://github.com/your-username/your-repo)' },
            )
            .setColor('Random')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};