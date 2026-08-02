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
        .setName('daily')
        .setDescription('💵 Daily coins'),
    async execute(interaction){
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));
        if(!json[user.id]) json[user.id]={coins:0,lastDaily:0};
        const now = Date.now();
        if(now-json[user.id].lastDaily<86400000) return interaction.reply('❌ You earned daily for today!');
        json[user.id].coins += 500;
        json[user.id].lastDaily = now;
        fs.writeFileSync(usersPath,JSON.stringify(json,null,2));
        await interaction.reply('💵 You got 500 coins!');
    }
};