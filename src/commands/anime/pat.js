// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Anime & Social',
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('🖐️ Give a gentle headpat to a member')
    .addUserOption(opt => opt.setName('target').setDescription('Member to pat').setRequired(true)),
  aliases: ['headpat'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('🖐️ Gentle Headpat!')
      .setDescription(`**${ctx.user.username}** gently patted **${targetUser.username}** on the head! ✨`)
      .setImage('https://media.giphy.com/media/L2QnEwN6G9T6k/giphy.gif')
      .setFooter({ text: 'AIO Anime Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
