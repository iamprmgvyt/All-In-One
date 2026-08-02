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
        .setName('crime')
        .setDescription('💀 Commit crime'),
    async execute(interaction){
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));
        if(!json[user.id]) json[user.id]={coins:0};
        const win = Math.random()<0.5;
        const amount = Math.floor(Math.random()*300)+50;
        if(win){
            json[user.id].coins += amount;
            await interaction.reply(`💀 Success, got ${amount} coins`);
        }else{
            json[user.id].coins = Math.max(0,json[user.id].coins-amount);
            await interaction.reply(`💀 Fail, lost ${amount} coins`);
        }
        fs.writeFileSync(usersPath,JSON.stringify(json,null,2));
    }
};