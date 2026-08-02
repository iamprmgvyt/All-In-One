// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { GuildModel } = require('../../utils/database');

module.exports = {
  category: 'Configuration',
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change the custom prefix for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName('prefix').setDescription('New prefix (e.g. !, ?, .)').setRequired(true)),
  aliases: ['prefix', 'changeprefix'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const newPrefix = ctx.isSlash ? ctx.interaction.options.getString('prefix') : ctx.args[0];
    if (!newPrefix || newPrefix.length > 5) return ctx.reply('❌ Prefix must be between 1 and 5 characters.');

    await GuildModel.findOneAndUpdate(
      { guildId: ctx.guild.id },
      { prefix: newPrefix },
      { upsert: true, new: true }
    ).catch(() => {});

    return ctx.reply(`✅ Server prefix updated successfully to: \`${newPrefix}\``);
  }
};
