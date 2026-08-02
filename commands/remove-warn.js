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
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/warns.json');

if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '{}');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-warn')
        .setDescription('❌ Remove a warning')
        .addUserOption(o => o.setName('user').setDescription('User to remove the warning from').setRequired(true))
        .addIntegerOption(o => o.setName('index').setDescription('Warning index number').setRequired(true)),
    
    async execute(interaction) {
        // Check if the user has the Manage Messages permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: '❌ You do not have permission to remove warnings!', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const index = interaction.options.getInteger('index') - 1;
        const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        if (!json[user.id] || !json[user.id][index]) {
            return interaction.reply({ content: '❌ Warning not found!', ephemeral: true });
        }

        const removed = json[user.id].splice(index, 1);
        fs.writeFileSync(dataPath, JSON.stringify(json, null, 2));
        await interaction.reply(`✅ Removed warning: ${removed}`);
    }
};

