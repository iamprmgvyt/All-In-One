// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const i18n = require('../../i18n');
const { GuildModel } = require('../../utils/database');

module.exports = {
  category: 'Configuration',
  data: new SlashCommandBuilder()
    .setName('setlang')
    .setDescription('Change the server language for i18n support (en, vi, ja, es, fr, de)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName('language').setDescription('Target language').setRequired(true).addChoices(
      { name: 'English (en)', value: 'en' },
      { name: 'Tiếng Việt (vi)', value: 'vi' },
      { name: '日本語 (ja)', value: 'ja' },
      { name: 'Español (es)', value: 'es' },
      { name: 'Français (fr)', value: 'fr' },
      { name: 'Deutsch (de)', value: 'de' }
    )),
  aliases: ['language', 'lang'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return ctx.reply({ content: '⛔ Admin permissions required.', ephemeral: true });
    }

    const lang = ctx.isSlash ? ctx.interaction.options.getString('language') : ctx.args[0];
    i18n.setGuildLanguage(ctx.guild.id, lang);

    await GuildModel.findOneAndUpdate(
      { guildId: ctx.guild.id },
      { language: lang },
      { upsert: true, new: true }
    ).catch(() => {});

    const msg = i18n.t('welcome', { server: ctx.guild.name, user: ctx.user.username }, lang);
    return ctx.reply(`✅ Language updated to \`${lang}\`!\nTest translation: ${msg}`);
  }
};
