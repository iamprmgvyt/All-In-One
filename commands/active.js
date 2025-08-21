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
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('active')
        .setDescription('Show all active commands.'),
    async execute(interaction) {
        // Build the embed content
        const commands = interaction.client.commands.map(cmd => cmd.data.name);
        const embed = new EmbedBuilder()
            .setTitle('📜 Active Commands')
            .setDescription(commands.length > 0 ? commands.map(c => `\`/${c}\``).join(', ') : 'No active commands found.')
            .setColor('Green')
            .setTimestamp();

        // Add a refresh button
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('refresh_active')
                .setLabel('🔄 Refresh')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({ embeds: [embed], components: [row] }); // public reply
    },
};
