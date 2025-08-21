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

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the bot\'s invitation link.'),
    
    // Giữ nguyên các tham số như cũ để đảm bảo không bị lỗi
    async execute(interaction, client, lang) {
        const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1477737195574&integration_type=0&scope=bot`;

        const embed = new EmbedBuilder()
            .setColor('#7c3aed')
            // Tiêu đề song ngữ
            .setTitle('Invite me')
            // Mô tả song ngữ với link
            .setDescription(`
Click the button below to invite me to your server.

[Invite Link](${inviteURL})
            `)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setImage("https://cdn.discordapp.com/attachments/1246408947708072027/1256597293323256000/invite.png?ex=668158ed&is=6680076d&hm=030c83f567ffdaf0bebb95e50baaec8bb8a8394fa1b7717cc43c3622447f58e3&")
            // Footer song ngữ
            .setFooter({ text: 'Thank you for using my bot!' })
            .setTimestamp();
        
        await interaction.reply({ 
            embeds: [embed],
            ephemeral: true 
        });
    },
};
