// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  category: 'Games & Fun',
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('🎮 Play an interactive game of TicTacToe against a friend')
    .addUserOption(opt => opt.setName('opponent').setDescription('User to challenge').setRequired(true)),
  aliases: ['ttt'],

  async execute(ctx) {
    const opponent = ctx.isSlash ? ctx.interaction.options.getUser('opponent') : ctx.message.mentions.users.first();
    if (!opponent || opponent.id === ctx.user.id || opponent.bot) {
      return ctx.reply('❌ Please challenge a valid non-bot user!');
    }

    const embed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle('🎮 TicTacToe Challenge!')
      .setDescription(`**${ctx.user.username}** (❌) challenged **${opponent.username}** (⭕)!\nTurn: **${ctx.user.username}**`)
      .setFooter({ text: 'AIO Interactive Games | Made by prmgvyt' })
      .setTimestamp();

    const createRow = (startIndex) => {
      const row = new ActionRowBuilder();
      for (let i = 0; i < 3; i++) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`ttt_${startIndex + i}`)
            .setLabel('➖')
            .setStyle(ButtonStyle.Secondary)
        );
      }
      return row;
    };

    return ctx.reply({
      content: `${opponent}, you have been challenged to TicTacToe!`,
      embeds: [embed],
      components: [createRow(0), createRow(3), createRow(6)]
    });
  }
};
