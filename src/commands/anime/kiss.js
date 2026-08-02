// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Anime & Social',
  data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('💋 Send a sweet anime kiss to a member')
    .addUserOption(opt => opt.setName('target').setDescription('Member to kiss').setRequired(true)),
  aliases: ['animekiss'],

  async execute(ctx) {
    const targetUser = (ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first()) || ctx.user;

    const embed = new EmbedBuilder()
      .setColor('#ec4899')
      .setTitle('💋 Sweet Anime Kiss!')
      .setDescription(`**${ctx.user.username}** kissed **${targetUser.username}**! 💖`)
      .setImage('https://media.giphy.com/media/Fq00VPZZAqs/giphy.gif')
      .setFooter({ text: 'AIO Anime Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
