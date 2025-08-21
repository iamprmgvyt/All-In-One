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
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');

function formatDate(date) {
    return Math.floor(date.getTime() / 1000);
}

function splitArray(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Shows server information'),

    async execute(interaction) {
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`
                **Server Information**
                > Created: <t:${formatDate(guild.createdAt)}:R>
                > Owner: <@${guild.ownerId}>
                
                **Members**
                > Total Members: **${guild.memberCount.toLocaleString()}**
                > Boost Level: **${guild.premiumTier}** (${guild.premiumSubscriptionCount || 0} boosts)
                
                **Channels & Roles**
                > Channels: **${guild.channels.cache.size}**
                > Roles: **${guild.roles.cache.size}**
                
                **Other Information**
                > Shard ID: **${guild.shardId}**
                > AFK Channel: **${guild.afkChannel ? `<#${guild.afkChannel.id}>` : 'Not set'}**
                > AFK Timeout: **${guild.afkTimeout / 60}** minutes
                > Verification Level: **${guild.verificationLevel}**
                > Explicit Content Filter: **${guild.explicitContentFilter ? 'Enabled' : 'Disabled'}**
                
                **Logo & Banner**
                > Server Logo: ${guild.iconURL({ size: 4096 }) ? `[Server Logo](${guild.iconURL({ size: 4096 })})` : 'N/A'}
                > Server Banner: ${guild.bannerURL({ size: 4096 }) ? `[Server Banner](${guild.bannerURL({ size: 4096 })})` : 'N/A'}
            `.trim())
            .setFooter({ 
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        const showRolesBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('showRoles')
                .setLabel('Show Roles')
                .setEmoji('📑')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [showRolesBtn]
        });

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120_000 // 2 minutes bitches!!
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'showRoles') {
                const roles = [...guild.roles.cache.values()]
                    .filter(role => role.id !== guild.id)
                    .sort((a, b) => b.position - a.position);

                const pages = splitArray(roles, 15);
                let pageIndex = 0;

                function getRoleEmbed(page) {
                    const roleList = pages[page]
                        .map(role => `> ${role} - ${role.members.size} members`)
                        .join('\n');

                    return new EmbedBuilder()
                        .setColor(0x2B2D31)
                        .setTitle('Server Roles')
                        .setDescription(roleList)
                        .setFooter({ 
                            text: `Page ${page + 1}/${pages.length} • ${roles.length} total roles`,
                            iconURL: i.user.displayAvatarURL()
                        });
                }

                const getButtons = (pageIndex) => {
                    return new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('≪')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(pageIndex === 0),
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(pageIndex === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(pageIndex === pages.length - 1),
                        new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('≫')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(pageIndex === pages.length - 1)
                    );
                };

                const components = roles.length > 15 ? [getButtons(pageIndex)] : [];
                const roleMsg = await i.reply({
                    embeds: [getRoleEmbed(pageIndex)],
                    components,
                    ephemeral: true,
                    fetchReply: true
                });

                if (roles.length <= 15) return;

                const roleCollector = roleMsg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 120000
                });

                roleCollector.on('collect', async (btnInt) => {
                    switch (btnInt.customId) {
                        case 'first':
                            pageIndex = 0;
                            break;
                        case 'prev':
                            pageIndex = Math.max(0, pageIndex - 1);
                            break;
                        case 'next':
                            pageIndex = Math.min(pages.length - 1, pageIndex + 1);
                            break;
                        case 'last':
                            pageIndex = pages.length - 1;
                            break;
                    }

                    await btnInt.update({
                        embeds: [getRoleEmbed(pageIndex)],
                        components: [getButtons(pageIndex)]
                    });
                });

                roleCollector.on('end', () => {
                    i.editReply({
                        components: []
                    }).catch(() => {});
                });
            }
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            }).catch(() => {});
        });
    },
};
