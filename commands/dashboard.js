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
    .setName('dashboard')
    .setDescription('Show interactive dashboard with buttons'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📊 Bot Dashboard')
      .setDescription('Welcome to the interactive dashboard. Use the buttons below to navigate.')
      .setColor('Random')
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('main')
        .setLabel('Main Commands')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('utility')
        .setLabel('Utility Commands')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('moderation')
        .setLabel('Moderation')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setLabel('Support Server')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/BA2SGyzykh')
    );

    // Reply lần đầu và lấy msg để tạo collector
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (i) => {
      await i.deferUpdate(); // tránh lỗi 50036

      let replyEmbed;
      if (i.customId === 'main') {
        replyEmbed = new EmbedBuilder()
          .setTitle('⚡ Main Commands')
          .setDescription('`/help`, `/ping`, `/uptime`, `/botinfo`')
          .setColor('Random');
      } else if (i.customId === 'utility') {
        replyEmbed = new EmbedBuilder()
          .setTitle('🛠 Utility Commands')
          .setDescription('`/userinfo`, `/serverinfo`, `/avatar`, `/roleinfo`, `/remind`')
          .setColor('Random');
      } else if (i.customId === 'moderation') {
        replyEmbed = new EmbedBuilder()
          .setTitle('🛡 Moderation Commands')
          .setDescription('`/ban`, `/unban`, `/managechannel`')
          .setColor('Random');
      }

      if (replyEmbed) {
        await i.followUp({ embeds: [replyEmbed], ephemeral: true });
      }
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};