// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Bet currency on the Slot Machine')
    .addIntegerOption(opt => opt.setName('bet').setDescription('Amount to bet').setRequired(true)),
  aliases: ['slot', 'spin'],

  async execute(ctx) {
    const bet = ctx.isSlash ? ctx.interaction.options.getInteger('bet') : parseInt(ctx.args[0]) || 50;

    if (bet <= 0) return ctx.reply('❌ Bet amount must be greater than 0.');

    let userData = await UserModel.findOne({ guildId: ctx.guild.id, userId: ctx.user.id }).catch(() => null);
    if (!userData) userData = new UserModel({ guildId: ctx.guild.id, userId: ctx.user.id, balance: 1000 });

    if (userData.balance < bet) {
      return ctx.reply(`❌ You don't have enough balance ($${userData.balance.toLocaleString()}) for this bet!`);
    }

    const items = ['🎰', '💎', '7️⃣', '🍒', '🍋'];
    const r1 = items[Math.floor(Math.random() * items.length)];
    const r2 = items[Math.floor(Math.random() * items.length)];
    const r3 = items[Math.floor(Math.random() * items.length)];

    let winMultiplier = 0;
    if (r1 === r2 && r2 === r3) {
      winMultiplier = 5; // Jackpot 5x
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      winMultiplier = 2; // Match 2x
    }

    if (winMultiplier > 0) {
      const winnings = bet * winMultiplier;
      userData.balance += winnings;
      await userData.save().catch(() => {});

      const embed = new EmbedBuilder()
        .setColor('#10b981')
        .setTitle('🎰 Slot Machine - JACKPOT!')
        .setDescription(`[ ${r1} | ${r2} | ${r3} ]\n\n🎉 You matched symbols and won **$${winnings.toLocaleString()}**! New Balance: **$${userData.balance.toLocaleString()}**`)
        .setFooter({ text: 'AIO Casino Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [embed] });
    } else {
      userData.balance -= bet;
      await userData.save().catch(() => {});

      const embed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('🎰 Slot Machine - NO MATCH')
        .setDescription(`[ ${r1} | ${r2} | ${r3} ]\n\n❌ You lost **$${bet.toLocaleString()}**. New Balance: **$${userData.balance.toLocaleString()}**`)
        .setFooter({ text: 'AIO Casino Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [embed] });
    }
  }
};
