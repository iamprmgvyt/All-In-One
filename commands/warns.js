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

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const warnsPath = path.join(__dirname,'../data/warns.json');

// Ensure file exists
if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, '{}');

// Safe read
function readWarns() {
    try {
        const data = fs.readFileSync(warnsPath,'utf8');
        return data ? JSON.parse(data) : {};
    } catch(err) {
        console.error('Warns JSON error, recreating file', err);
        fs.writeFileSync(warnsPath,'{}');
        return {};
    }
}

// Safe write
function writeWarns(json) {
    fs.writeFileSync(warnsPath, JSON.stringify(json,null,2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('⚠️ Manage warns')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Add warn to a user')
                .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
                .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('list')
                .setDescription('List warns of a user')
                .addUserOption(o => o.setName('user').setDescription('User').setRequired(false))
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a warn')
                .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
                .addIntegerOption(o => o.setName('index').setDescription('Warn index').setRequired(true))
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const json = readWarns();

        // Permission check for add/remove
        if (['add', 'remove'].includes(sub)) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
                !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You do not have permission to use this command!', ephemeral: true });
            }
        }

        if (sub === 'add') {
            const target = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            if (!json[target.id]) json[target.id] = [];
            json[target.id].push({ reason, moderator: interaction.user.tag, date: new Date().toISOString() });
            writeWarns(json);
            await interaction.reply(`⚠️ Added warn to ${target.tag} | Reason: ${reason}`);
        } 
        else if (sub === 'list') {
            const target = interaction.options.getUser('user') || interaction.user;
            const warns = json[target.id] || [];
            if (warns.length === 0) return interaction.reply(`✅ ${target.tag} has no warns.`);
            const embed = new EmbedBuilder()
                .setTitle(`⚠️ Warns of ${target.tag}`)
                .setDescription(warns.map((w,i)=>`${i+1}. ${w.reason} - by ${w.moderator}`).join('\n'))
                .setColor('Random');
            await interaction.reply({ embeds: [embed] });
        } 
        else if (sub === 'remove') {
            const target = interaction.options.getUser('user');
            const index = interaction.options.getInteger('index') - 1;
            if (!json[target.id] || !json[target.id][index]) return interaction.reply('❌ Did not find this warn');
            const removed = json[target.id].splice(index, 1);
            writeWarns(json);
            await interaction.reply(`✅ Removed warn "${removed[0].reason}" from ${target.tag}`);
        }
    }
};
