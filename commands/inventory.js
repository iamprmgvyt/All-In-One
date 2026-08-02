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
if(!fs.existsSync(usersPath)) fs.writeFileSync(usersPath,'{}');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('🎒 Xem vật phẩm / Check inventory'),
    async execute(interaction){
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));
        const inv = json[user.id] ? json[user.id].inventory.join(', ') : 'Chưa có vật phẩm';
        await interaction.reply(`🎒 Inventory: ${inv}`);
    }
};