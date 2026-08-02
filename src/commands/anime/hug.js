// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Anime',
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a warm anime hug')
    .addUserOption(opt => opt.setName('target').setDescription('User to hug').setRequired(true)),
  aliases: ['animehug'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first());
    if (!targetUser) return ctx.reply('❌ Please specify a user to hug!');

    const animeGifs = [
      'https://media.giphy.com/media/l2QDM9Jnim1YV55YA/giphy.gif',
      'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWxidWZrb3pva3prbmswcnlybHRrYmVyMGRucHRtdHFtd2VvZGdyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u9PyIWFts3V04/giphy.gif'
    ];
    const gif = animeGifs[Math.floor(Math.random() * animeGifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setDescription(`🤗 **${ctx.user.username}** gave **${targetUser.username}** a warm hug!`)
      .setImage(gif)
      .setFooter({ text: 'AIO Anime Suite | Made by prmgvyt' });

    return ctx.reply({ embeds: [embed] });
  }
};
