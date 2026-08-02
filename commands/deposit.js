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
const usersPath = path.join(__dirname, '../data/users.json');

// Create users.json if it doesn't exist
if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, '{}');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('🏦 Deposit coins into the bank')
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of coins to deposit').setRequired(true)),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = interaction.user;

        // Read users data
        let json;
        try {
            json = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        } catch (error) {
            return interaction.reply('❌ Unable to read user data. Please try again later.');
        }

        // Initialize user data if not present
        if (!json[user.id]) {
            json[user.id] = { coins: 0, bank: 0 };
        }

        // Check if the user has enough coins to deposit
        if (json[user.id].coins < amount) {
            return interaction.reply('❌ You do not have enough coins to deposit!');
        }

        // Update user data
        json[user.id].coins -= amount;
        json[user.id].bank += amount;

        // Write updated data back to the file
        try {
            fs.writeFileSync(usersPath, JSON.stringify(json, null, 2));
        } catch (error) {
            return interaction.reply('❌ Unable to save user data. Please try again later.');
        }

        // Send confirmation message
        await interaction.reply(`🏦 You have successfully deposited ${amount} coins into the bank!`);
    }
};

