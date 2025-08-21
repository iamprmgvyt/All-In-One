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

if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, '{}');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('💰 Rob a user')
        .addUserOption(o => o.setName('user').setDescription('User to rob').setRequired(true)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

        // Initialize user and target if they don't exist
        if (!json[user.id]) json[user.id] = { coins: 0 };
        if (!json[target.id]) json[target.id] = { coins: 0 };

        // Calculate the amount to rob
        const amount = Math.floor(Math.random() * json[target.id].coins);
        
        // Adjust the coins of both users
        json[target.id].coins -= amount;
        json[user.id].coins += amount;

        // Save the updated data
        fs.writeFileSync(usersPath, JSON.stringify(json, null, 2));

        // Send a reply to the user
        await interaction.reply(`💰 You stole ${amount} coins from ${target.tag}`);
    }
};

