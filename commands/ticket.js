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
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Create a support ticket'),

  async execute(interaction) {
    const guild = interaction.guild;
    const supportRoleId = process.env.SUPPORT_ROLE_ID;
    if (!supportRoleId) {
      return interaction.reply({ content: '❌ Missing SUPPORT_ROLE_ID in .env' });
    }

    // Find or create the "Tickets" category
    let category = guild.channels.cache.find(
      c => c.name === 'Tickets' && c.type === ChannelType.GuildCategory
    );
    if (!category) {
      category = await guild.channels.create({
        name: 'Tickets',
        type: ChannelType.GuildCategory,
      });
    }

    // Prevent multiple tickets per user: use topic to track owner
    const existingTicket = guild.channels.cache.find(
      c => c.parentId === category.id && c.topic === `owner:${interaction.user.id}`
    );
    if (existingTicket) {
      return interaction.reply({
        content: `❌ You already have an open ticket: ${existingTicket}`,
      });
    }

    // Create ticket channel
    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      parent: category.id,
      topic: `owner:${interaction.user.id}`, // keep it short & easy to parse
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
      ],
    });

    // Create an embed message
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('New Ticket Created 🎟️')
      .setDescription(`Hello ${interaction.user}, please wait for support!`)
      .addFields(
        { name: 'Ticket ID', value: channel.id, inline: true },
        { name: 'Created By', value: interaction.user.tag, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Support Team', iconURL: guild.iconURL() });

    // Buttons: Claim + Close
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('✅ Claim Ticket')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('❌ Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ content: `🎫 Ticket created: ${channel}` });
    await channel.send({
      embeds: [embed],
      components: [buttons],
    });
  },
};
