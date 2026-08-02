const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('🔎 Get information about a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Select a user')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new EmbedBuilder()
            .setColor('#00BFFF')
            .setAuthor({ name: `${user.username}'s Information`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '👤 Username', value: `${user.tag}`, inline: true },
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '📆 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: false },
                { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
                { name: '🎭 Roles', value: member.roles.cache.map(r => r).join(' ') || 'No Roles', inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
