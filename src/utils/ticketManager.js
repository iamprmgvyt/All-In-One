// Made by prmgvyt
const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const logger = require('./logger');

class TicketManager {
  constructor() {
    this.activeTickets = new Map(); // channelId -> ticketData
  }

  async sendTicketPanel(channel) {
    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🎫 SUPPORT TICKET SYSTEM')
      .setDescription(
        'Need assistance? Click the button below or choose a category from the dropdown menu to open a private support ticket!\n\n' +
        '**Available Categories:**\n' +
        '• 🛠️ **General Support**: General questions & help\n' +
        '• 💳 **Billing & Payments**: Purchases, donations & rank upgrades\n' +
        '• 🐛 **Bug Report**: Report bugs or technical issues\n' +
        '• 🚨 **Member Report**: Report rule violations'
      )
      .setFooter({ text: 'AIO Ticket Suite | Made by prmgvyt' })
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category_select')
      .setPlaceholder('📌 Select ticket category...')
      .addOptions([
        { label: 'General Support', value: 'ticket_cat_support', description: 'General questions & help', emoji: '🛠️' },
        { label: 'Billing & Payments', value: 'ticket_cat_billing', description: 'Purchases & donations', emoji: '💳' },
        { label: 'Bug Report', value: 'ticket_cat_bug', description: 'Report technical bugs', emoji: '🐛' },
        { label: 'Member Report', value: 'ticket_cat_report', description: 'Report rule violations', emoji: '🚨' }
      ]);

    const rowMenu = new ActionRowBuilder().addComponents(selectMenu);
    const rowButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_create_general')
        .setLabel('🎫 Create Support Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    return await channel.send({ embeds: [embed], components: [rowMenu, rowButton] });
  }

  async createTicketChannel(guild, user, topic = 'General Support', category = 'Support') {
    const cleanUsername = user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const channelName = `ticket-${category.toLowerCase()}-${cleanUsername}`;

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
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory]
        },
        {
          id: guild.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        }
      ]
    });

    const ticketData = {
      channelId: channel.id,
      guildId: guild.id,
      userId: user.id,
      topic,
      category,
      claimedBy: null,
      closed: false,
      createdAt: new Date()
    };
    this.activeTickets.set(channel.id, ticketData);

    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle(`🎫 Ticket [${category.toUpperCase()}]: ${topic}`)
      .setDescription(
        `Welcome ${user}! A staff member will be with you shortly.\n\n` +
        `**Ticket Information:**\n` +
        `• **User**: ${user.tag} (\`${user.id}\`)\n` +
        `• **Category**: ${category}\n` +
        `• **Topic**: ${topic}\n\n` +
        `Use the control buttons below to manage this ticket:`
      )
      .setFooter({ text: 'AIO Ticket Suite | Made by prmgvyt' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`close_ticket_${channel.id}`).setLabel('🔒 Close Ticket').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId(`claim_ticket_${channel.id}`).setLabel('👑 Claim Ticket').setStyle(ButtonStyle.Success)
    );

    await channel.send({ content: `${user}`, embeds: [embed], components: [row] });
    logger.info(`🎫 Ticket channel created: ${channel.name} for user ${user.tag}`);
    return channel;
  }

  async claimTicket(channel, staffUser) {
    const ticketData = this.activeTickets.get(channel.id);
    if (!ticketData) return { success: false, reason: 'NOT_A_TICKET' };

    if (ticketData.claimedBy) {
      return { success: false, reason: 'ALREADY_CLAIMED', claimedBy: ticketData.claimedBy };
    }

    ticketData.claimedBy = staffUser.id;

    const embed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('👑 Ticket Claimed')
      .setDescription(`This ticket has been claimed by ${staffUser}. They will assist you with your inquiry.`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    return { success: true };
  }

  async addUserToTicket(channel, user) {
    try {
      await channel.permissionOverwrites.edit(user.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });
      await channel.send(`✅ Added ${user} to the ticket.`);
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeUserFromTicket(channel, user) {
    try {
      await channel.permissionOverwrites.delete(user.id);
      await channel.send(`🚫 Removed ${user} from the ticket.`);
      return true;
    } catch (e) {
      return false;
    }
  }

  async closeTicketChannel(channel, closedByUser) {
    logger.info(`🔒 Ticket channel closing: ${channel.name} by ${closedByUser.tag}`);

    const ticketData = this.activeTickets.get(channel.id);
    if (ticketData) ticketData.closed = true;

    // Generate Transcript Summary Log
    let transcriptText = `=== AIO SUPPORT TICKET TRANSCRIPT ===\nChannel: ${channel.name}\nGuild: ${channel.guild.name}\nClosed By: ${closedByUser.tag}\nTime: ${new Date().toISOString()}\n=====================================\n\n`;

    try {
      const fetchedMessages = await channel.messages.fetch({ limit: 100 }).catch(() => null);
      if (fetchedMessages) {
        fetchedMessages.reverse().forEach(m => {
          transcriptText += `[${m.createdAt.toISOString()}] ${m.author.tag}: ${m.content}\n`;
        });
      }
    } catch (e) {}

    const embed = new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle('🔒 Ticket Closed')
      .setDescription(`Ticket closed by ${closedByUser}.\nChannel will be deleted in 5 seconds...`)
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    setTimeout(async () => {
      this.activeTickets.delete(channel.id);
      await channel.delete().catch(() => {});
    }, 5000);
  }
}

module.exports = new TicketManager();
