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
const dataPath = path.join(__dirname,'../data/xp.json');
if(!fs.existsSync(dataPath)) fs.writeFileSync(dataPath,'{}');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('xp')
        .setDescription('⭐ Check XP')
        .addUserOption(o=>o.setName('user').setDescription('User').setRequired(false)),
    async execute(interaction){
        const user = interaction.options.getUser('user')||interaction.user;
        const json = JSON.parse(fs.readFileSync(dataPath,'utf8'));
        const xp = json[user.id]||0;
        await interaction.reply(`⭐ ${user.tag} has ${xp} XP`);
    }
};