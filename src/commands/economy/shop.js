// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse server shop items & virtual goods'),
  aliases: ['store', 'items'],

  async execute(ctx) {
    const embed = new EmbedBuilder()
      .setColor('#f59e0b')
      .setTitle('🛒 AIO Virtual Item Shop')
      .setDescription('Use `/buy <item_id>` or `!buy <item_id>` to purchase items!\n')
      .addFields(
        { name: 'VIP Role Badge (`vip_badge`)', value: 'Price: `$5,000` | Unlocks VIP Embed Badge', inline: false },
        { name: 'Custom Role Color (`role_color`)', value: 'Price: `$10,000` | Change custom name color', inline: false },
        { name: 'Double XP Boost (`xp_boost`)', value: 'Price: `$2,500` | 2x XP multiplier for 24h', inline: false }
      )
      .setFooter({ text: 'AIO Economy Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
