// Made by prmgvyt
const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const logger = require('./logger');

class TicketManager {
  constructor() {
    this.activeTickets = new Map(); // channelId -> ticketData
  }

  async createTicketChannel(guild, user, topic = 'General Support') {
    const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles]
        },
        {
          id: guild.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
        }
      ]
    });

    const ticketData = {
      channelId: channel.id,
      guildId: guild.id,
      userId: user.id,
      topic,
      createdAt: new Date()
    };
    this.activeTickets.set(channel.id, ticketData);

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`🎫 Ticket Created: ${topic}`)
      .setDescription(`Welcome ${user}! A staff member will be with you shortly.\n\nClick **Close Ticket** below when your inquiry is complete.`)
      .setFooter({ text: 'AIO Ticket System | Made by prmgvyt' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`close_ticket_${channel.id}`)
        .setLabel('🔒 Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `${user}`, embeds: [embed], components: [row] });
    logger.info(`🎫 Ticket channel created: ${channel.name} for user ${user.tag}`);
    return channel;
  }

  async closeTicketChannel(channel, closedByUser) {
    logger.info(`🔒 Ticket channel closing: ${channel.name} by ${closedByUser.tag}`);

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('🔒 Ticket Closing')
      .setDescription(`This ticket has been closed by ${closedByUser}. Channel will be deleted in 5 seconds...`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    setTimeout(async () => {
      this.activeTickets.delete(channel.id);
      await channel.delete().catch(() => {});
    }, 5000);
  }
}

module.exports = new TicketManager();
