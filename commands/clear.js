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
        .setName('clear')
        .setDescription('🧹 Clear messages')
        .addIntegerOption(o=>o.setName('amount').setDescription('Amount').setRequired(true)),
    async execute(interaction){
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount, true).catch(()=>{});
        await interaction.reply({ content:`🧹 Clear ${amount} messages`, ephemeral:true });
    }
};