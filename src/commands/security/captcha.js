// Made by prmgvyt
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const captchaEngine = require('../../security/captchaEngine');

module.exports = {
  category: 'Security',
  data: new SlashCommandBuilder()
    .setName('captcha')
    .setDescription('Trigger a Multi-Mode Anti-OCR CAPTCHA verification test')
    .addStringOption(opt => opt.setName('mode').setDescription('CAPTCHA mode (TEXT or MATH)').addChoices(
      { name: 'Distorted Text CAPTCHA', value: 'TEXT' },
      { name: 'Math Visual CAPTCHA', value: 'MATH' }
    )),
  aliases: ['verify', 'captchatest'],

  async execute(ctx) {
    const mode = (ctx.isSlash ? ctx.interaction.options.getString('mode') : ctx.args[0]) || 'TEXT';
    const session = await captchaEngine.createSession(ctx.user.id, mode.toUpperCase());

    const attachment = new AttachmentBuilder(session.imageBuffer, { name: 'captcha.png' });

    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle('🔒 Multi-Mode Anti-OCR CAPTCHA Verification')
      .setDescription(`Solve the CAPTCHA image below. Type your response in chat within **3 minutes**.\nMode: **${session.mode}**`)
      .setImage('attachment://captcha.png')
      .setFooter({ text: 'AIO Anti-OCR CAPTCHA Engine | Made by prmgvyt' })
      .setTimestamp();

    await ctx.reply({ embeds: [embed], files: [attachment] });
  }
};
