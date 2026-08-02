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
        .setName('buy')
        .setDescription('💰 Buy item')
        .addStringOption(o=>o.setName('item').setDescription('Item name').setRequired(true)),
    async execute(interaction){
        const user = interaction.user;
        const item = interaction.options.getString('item');
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));
        if(!json[user.id]) json[user.id]={coins:1000,inventory:[]};
        if(json[user.id].coins<100) return interaction.reply('❌ Not enough coins!');
        json[user.id].coins -= 100;
        json[user.id].inventory.push(item);
        fs.writeFileSync(usersPath,JSON.stringify(json,null,2));
        await interaction.reply(`✅ Bought: ${item}`);
    }
};