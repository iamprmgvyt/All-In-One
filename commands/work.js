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
        .setName('work')
        .setDescription('💼 Work for coins'),
    async execute(interaction){
        const user = interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));
        if(!json[user.id]) json[user.id]={coins:0};
        const amount = Math.floor(Math.random()*500)+50;
        json[user.id].coins += amount;
        fs.writeFileSync(usersPath,JSON.stringify(json,null,2));
        await interaction.reply(`💼 You got ${amount} coins`);
    }
};