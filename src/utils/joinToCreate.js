// Made by prmgvyt
const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const logger = require('./logger');

class JoinToCreateEngine {
  constructor() {
    this.generatorChannels = new Set(); // channelIds set as generator
    this.tempChannels = new Map(); // tempChannelId -> { guildId, ownerId }
  }

  setGeneratorChannel(channelId) {
    this.generatorChannels.add(channelId);
  }

  async createControlPanel(tempVoiceChannel, ownerMember) {
    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle(`🎛️ J2C Voice Control Panel: ${tempVoiceChannel.name}`)
      .setDescription(`Welcome ${ownerMember}! Use the interactive control buttons below to manage your temporary voice room like popular bots.`)
      .addFields(
        { name: '🔒 / 🔓 Lock & Unlock', value: 'Control who can join your room', inline: true },
        { name: '👁️ / 👁️‍🗨️ Hide & Unhide', value: 'Control channel visibility', inline: true },
        { name: '✏️ Rename Room', value: 'Change custom voice room name', inline: true },
        { name: '👑 Claim Owner', value: 'Claim ownership if owner left', inline: true }
      )
      .setFooter({ text: 'All-In-One J2C Control Suite | Made by prmgvyt' })
      .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`j2c_lock_${tempVoiceChannel.id}`).setLabel('🔒 Lock').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`j2c_unlock_${tempVoiceChannel.id}`).setLabel('🔓 Unlock').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`j2c_hide_${tempVoiceChannel.id}`).setLabel('👁️ Hide').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`j2c_unhide_${tempVoiceChannel.id}`).setLabel('👁️‍🗨️ Unhide').setStyle(ButtonStyle.Success)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`j2c_rename_${tempVoiceChannel.id}`).setLabel('✏️ Rename').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`j2c_claim_${tempVoiceChannel.id}`).setLabel('👑 Claim Owner').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`j2c_limit_${tempVoiceChannel.id}`).setLabel('👥 Set Limit').setStyle(ButtonStyle.Secondary)
    );

    try {
      await tempVoiceChannel.send({ content: `${ownerMember}`, embeds: [embed], components: [row1, row2] });
    } catch (e) {
      logger.warn(`Could not send J2C control panel in voice text: ${e.message}`);
    }
  }

  async handleVoiceStateUpdate(oldState, newState) {
    const member = newState.member;
    const guild = newState.guild;

    // 1. User joins a Join-to-Create Generator channel
    if (newState.channelId && (this.generatorChannels.has(newState.channelId) || oldState.channelId !== newState.channelId)) {
      if (this.generatorChannels.has(newState.channelId)) {
        try {
          const generatorChannel = newState.channel;
          const parentCategory = generatorChannel.parentId;

          // Create temporary voice channel
          const tempChannel = await guild.channels.create({
            name: `🔊 ${member.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            parent: parentCategory || null,
            permissionOverwrites: [
              {
                id: member.id,
                allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
              }
            ]
          });

          this.tempChannels.set(tempChannel.id, { guildId: guild.id, ownerId: member.id });
          logger.info(`🎙️ JoinToCreate: Created temporary channel ${tempChannel.name} for ${member.user.tag}`);

          // Move member to new channel
          await member.voice.setChannel(tempChannel);

          // Send interactive Control Panel inside voice text channel
          await this.createControlPanel(tempChannel, member);
        } catch (err) {
          logger.error('Error creating Join-to-Create voice channel:', err);
        }
      }
    }

    // 2. User leaves a temporary created voice channel
    if (oldState.channelId && oldState.channelId !== newState.channelId) {
      const tempChannelId = oldState.channelId;
      if (this.tempChannels.has(tempChannelId)) {
        const channel = oldState.channel;
        if (channel && channel.members.size === 0) {
          try {
            await channel.delete();
            this.tempChannels.delete(tempChannelId);
            logger.info(`🧹 JoinToCreate: Cleaned up empty channel ${channel.name}`);
          } catch (err) {
            logger.error(`Error deleting temp channel ${tempChannelId}:`, err);
          }
        }
      }
    }
  }

  async handleButtonAction(interaction) {
    const customId = interaction.customId;
    if (!customId.startsWith('j2c_')) return false;

    const parts = customId.split('_');
    const action = parts[1]; // lock, unlock, hide, unhide, rename, claim, limit
    const voiceChannelId = parts[2];

    const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);
    if (!voiceChannel) {
      await interaction.reply({ content: '❌ Temporary voice channel no longer exists.', ephemeral: true });
      return true;
    }

    const channelData = this.tempChannels.get(voiceChannelId);
    const isOwner = channelData && channelData.ownerId === interaction.user.id;

    if (!isOwner && action !== 'claim') {
      await interaction.reply({ content: '⛔ Only the room owner can use these control buttons.', ephemeral: true });
      return true;
    }

    try {
      if (action === 'rename') {
        const modal = new ModalBuilder()
          .setCustomId(`j2c_modal_rename_${voiceChannelId}`)
          .setTitle('✏️ Rename Your Voice Room');

        const nameInput = new TextInputBuilder()
          .setCustomId('j2c_new_name')
          .setLabel('New Channel Name')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('🔊 Chill Gaming Lounge')
          .setRequired(true)
          .setMaxLength(32);

        const row = new ActionRowBuilder().addComponents(nameInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
        return true;
      } else if (action === 'lock') {
        await voiceChannel.permissionOverwrites.edit(interaction.guild.id, { Connect: false });
        await interaction.reply({ content: '🔒 Voice channel locked! `@everyone` can no longer join.', ephemeral: true });
      } else if (action === 'unlock') {
        await voiceChannel.permissionOverwrites.edit(interaction.guild.id, { Connect: true });
        await interaction.reply({ content: '🔓 Voice channel unlocked! Everyone can join.', ephemeral: true });
      } else if (action === 'hide') {
        await voiceChannel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });
        await interaction.reply({ content: '👁️ Voice channel hidden from `@everyone`.', ephemeral: true });
      } else if (action === 'unhide') {
        await voiceChannel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: true });
        await interaction.reply({ content: '👁️‍🗨️ Voice channel unhidden.', ephemeral: true });
      } else if (action === 'claim') {
        const currentOwnerMember = await interaction.guild.members.fetch(channelData.ownerId).catch(() => null);
        const ownerInChannel = currentOwnerMember && currentOwnerMember.voice.channelId === voiceChannelId;

        if (ownerInChannel) {
          await interaction.reply({ content: '❌ Room owner is currently inside the voice channel. Cannot claim ownership.', ephemeral: true });
        } else {
          channelData.ownerId = interaction.user.id;
          await interaction.reply({ content: `👑 ${interaction.user} claimed room ownership!`, ephemeral: false });
        }
      } else if (action === 'limit') {
        await voiceChannel.setUserLimit(voiceChannel.userLimit === 5 ? 0 : 5);
        await interaction.reply({ content: `👥 Member limit updated to: **${voiceChannel.userLimit}**`, ephemeral: true });
      }
    } catch (err) {
      logger.error(`Error handling J2C button action [${action}]:`, err);
      await interaction.reply({ content: '❌ Failed to execute channel control action.', ephemeral: true });
    }

    return true;
  }

  async handleModalSubmit(interaction) {
    if (!interaction.customId.startsWith('j2c_modal_rename_')) return false;

    const voiceChannelId = interaction.customId.replace('j2c_modal_rename_', '');
    const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);

    if (!voiceChannel) {
      await interaction.reply({ content: '❌ Voice channel no longer exists.', ephemeral: true });
      return true;
    }

    const newName = interaction.fields.getTextInputValue('j2c_new_name');
    try {
      await voiceChannel.setName(newName);
      await interaction.reply({ content: `✏️ Voice channel renamed successfully to: **${newName}**!`, ephemeral: true });
      logger.info(`✏️ J2C: ${interaction.user.tag} renamed voice channel ${voiceChannelId} to "${newName}"`);
    } catch (err) {
      logger.error('Failed to rename J2C voice channel:', err);
      await interaction.reply({ content: '❌ Failed to rename channel. Rate limit or invalid name.', ephemeral: true });
    }
    return true;
  }
}

module.exports = new JoinToCreateEngine();
