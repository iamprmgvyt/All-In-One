// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const joinToCreate = require('../../utils/joinToCreate');

module.exports = {
  category: 'Configuration',
  data: new SlashCommandBuilder()
    .setName('setupjtc')
    .setDescription('Configure a voice channel as a Join-to-Create generator channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt => opt.setName('channel').setDescription('Voice channel to set as generator').setRequired(true)),
  aliases: ['jtcsetup', 'joincreate'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const channel = ctx.isSlash ? ctx.interaction.options.getChannel('channel') : ctx.message.mentions.channels.first();
    if (!channel || channel.type !== 2) { // 2 = GuildVoice
      return ctx.reply('❌ Please specify a valid **Voice Channel**.');
    }

    joinToCreate.setGeneratorChannel(channel.id);

    return ctx.reply(`🎙️ **Join-to-Create Voice Generator** successfully set to <#${channel.id}>! Anyone who joins this channel will get a custom temporary voice room created automatically.`);
  }
};
