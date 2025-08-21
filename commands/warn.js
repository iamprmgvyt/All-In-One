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
        .setName('warn')
        .setDescription('⚠️ Warn a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to warn')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Permission check
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command!',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (!json[user.id]) json[user.id] = [];
        json[user.id].push(reason);
        fs.writeFileSync(dataPath, JSON.stringify(json, null, 2));

        await interaction.reply(`⚠️ Warned ${user.tag}\nReason: ${reason}`);
    }
};
