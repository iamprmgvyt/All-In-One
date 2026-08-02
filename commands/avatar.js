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
module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('🖼️ Show avatar')
        .addUserOption(option => option.setName('user').setDescription('User').setRequired(false)),
    async execute(interaction){
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic:true, size:1024 })}`);
    }
};