// 
// +---+---+---+
// | A | I | O |
// +---+---+---+
// +---+---+---+
// | B | Y |   |
// +---+---+---+
// +---+---+---+---+---+---+---+---+
// | P | R | M | G | V | Y | T |   |
// +---+---+---+---+---+---+---+---+
//

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname,'../data/users.json');
if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath,'{}');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('🏦 Withdraw coins from your bank')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Amount to withdraw')
                .setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));

        if (!json[user.id]) json[user.id] = { coins: 0, bank: 0 };

        if ((json[user.id].bank || 0) < amount) {
            return interaction.reply('❌ You do not have enough coins in your bank!');
        }

        json[user.id].bank -= amount;
        json[user.id].coins += amount;

        fs.writeFileSync(usersPath, JSON.stringify(json, null, 2));

        await interaction.reply(`🏦 You have withdrawn ${amount} coins from your bank.`);
    }
};
