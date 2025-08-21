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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('🎭 Add or remove role')
        .addUserOption(o => o.setName('user').setDescription('User to modify').setRequired(true))
        .addRoleOption(o => o.setName('role').setDescription('Role to add or remove').setRequired(true)),
    
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        // Check if the user has permission to manage roles
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({ content: '❌ You do not have permission to manage roles!', ephemeral: true });
        }

        // Check if the member already has the role
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.reply(`❌ Removed role ${role.name} from ${member.user.tag}`);
        } else {
            await member.roles.add(role);
            await interaction.reply(`✅ Added role ${role.name} to ${member.user.tag}`);
        }
    }
};

