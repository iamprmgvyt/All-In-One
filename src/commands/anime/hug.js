// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Anime & Social',
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('🤗 Give a warm anime hug to another server member')
    .addUserOption(opt => opt.setName('target').setDescription('Member to hug').setRequired(true)),
  aliases: ['animehug'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const hugGifs = [
      'https://media.giphy.com/media/l2QDM9Jnim1YV55YA/giphy.gif',
      'https://media.giphy.com/media/vVA8U5oACiSKc/giphy.gif',
      'https://media.giphy.com/media/3zn09nEvuQ1e/giphy.gif'
    ];
    const gif = hugGifs[Math.floor(Math.random() * hugGifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('🤗 Warm Anime Hug!')
      .setDescription(`**${ctx.user.username}** gave a big warm hug to **${targetUser.username}**! ❤️`)
      .setImage(gif)
      .setFooter({ text: 'AIO Anime Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
