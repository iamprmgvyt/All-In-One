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
const dataPath = path.join(__dirname,'../data/afk.json');
if(!fs.existsSync(dataPath)) fs.writeFileSync(dataPath,'{}');
module.exports = {
    data:new SlashCommandBuilder()
        .setName('afk')
        .setDescription('💤 Set AFK')
        .addStringOption(o=>o.setName('reason').setDescription('Reason').setRequired(false)),
    async execute(interaction){
        const user = interaction.user;
        const reason = interaction.options.getString('reason')||'No reason';
        const json = JSON.parse(fs.readFileSync(dataPath,'utf8'));
        json[user.id] = reason;
        fs.writeFileSync(dataPath,JSON.stringify(json,null,2));
        await interaction.reply(`💤 ${user.tag} AFK: ${reason}`);
    }
};