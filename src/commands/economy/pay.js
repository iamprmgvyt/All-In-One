// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { UserModel } = require('../../utils/database');

module.exports = {
  category: 'Economy & RPG',
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer currency to another server member')
    .addUserOption(opt => opt.setName('target').setDescription('Recipient user').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to transfer').setRequired(true)),
  aliases: ['transfer', 'givemoney'],

  async execute(ctx) {
    const targetUser = ctx.isSlash ? ctx.interaction.options.getUser('target') : ctx.message.mentions.users.first();
    const amount = ctx.isSlash ? ctx.interaction.options.getInteger('amount') : parseInt(ctx.args[1]);

    if (!targetUser || targetUser.id === ctx.user.id || targetUser.bot) {
      return ctx.reply('❌ Please specify a valid non-bot user to transfer currency to.');
    }

    if (!amount || amount <= 0) return ctx.reply('❌ Please enter a valid positive transfer amount.');

    let senderData = await UserModel.findOne({ guildId: ctx.guild.id, userId: ctx.user.id }).catch(() => null);
    if (!senderData) senderData = new UserModel({ guildId: ctx.guild.id, userId: ctx.user.id, balance: 1000 });

    if (senderData.balance < amount) {
      return ctx.reply(`❌ You do not have enough balance ($${senderData.balance.toLocaleString()}) to send $${amount}.`);
    }

    let recipientData = await UserModel.findOne({ guildId: ctx.guild.id, userId: targetUser.id }).catch(() => null);
    if (!recipientData) recipientData = new UserModel({ guildId: ctx.guild.id, userId: targetUser.id, balance: 1000 });

    senderData.balance -= amount;
    recipientData.balance += amount;

    await senderData.save().catch(() => {});
    await recipientData.save().catch(() => {});

    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle('💸 Currency Transfer Successful')
      .setDescription(`You transferred **$${amount.toLocaleString()}** to ${targetUser}!\nYour Remaining Balance: **$${senderData.balance.toLocaleString()}**`)
      .setFooter({ text: 'AIO Economy Suite | Made by prmgvyt' })
      .setTimestamp();

    return ctx.reply({ embeds: [embed] });
  }
};
