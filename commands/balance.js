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

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname,'../data/users.json');
if(!fs.existsSync(usersPath)) fs.writeFileSync(usersPath,'{}');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('💰 Check balance')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(false)),

    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const json = JSON.parse(fs.readFileSync(usersPath,'utf8'));

        // Khởi tạo nếu chưa có
        if (!json[target.id]) json[target.id] = { coins: 0, bank: 0 };

        const coins = json[target.id].coins || 0;
        const bank = json[target.id].bank || 0;

        const embed = new EmbedBuilder()
            .setTitle(`💰 Balance : ${target.tag}`)
            .setDescription(`**Wallet:** ${coins} coin\n**Bank:** ${bank} coins`)
            .setColor('Random');

        await interaction.reply({ embeds: [embed] });
    }
};