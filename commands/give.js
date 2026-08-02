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

// Ensure the users.json file exists
if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, '{}');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('💸 Transfer coins to another user / Give coins')
        .addUserOption(o => o.setName('user').setDescription('Receiver').setRequired(true))
        .addIntegerOption(o => o.setName('amount').setDescription('Amount of coins').setRequired(true)),
    
    async execute(interaction) {
        const target = interaction.options.getUser('user'); // Get the receiver
        const amount = interaction.options.getInteger('amount'); // Get the amount to transfer
        const user = interaction.user; // Get the user executing the command
        
        // Read the users' data from the JSON file
        const json = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        
        // Initialize user balances if they don't exist
        if (!json[user.id]) json[user.id] = { coins: 0 };
        if (!json[target.id]) json[target.id] = { coins: 0 };
        
        // Check if the user has enough coins
        if (json[user.id].coins < amount) {
            return interaction.reply('❌ You do not have enough coins!'); // Error message for insufficient coins
        }
        
        // Perform the transfer
        json[user.id].coins -= amount; // Deduct coins from the sender
        json[target.id].coins += amount; // Add coins to the receiver
        
        // Write the updated data back to the JSON file
        fs.writeFileSync(usersPath, JSON.stringify(json, null, 2));
        
        // Confirm the transfer to the user
        await interaction.reply(`💸 You have sent ${amount} coins to ${target.tag}`); // Confirmation message
    }
};

