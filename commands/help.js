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
const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),

    async execute(interaction) {
        const commandsPath = path.join(__dirname); // folder chứa lệnh trực tiếp
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const embed = new EmbedBuilder()
            .setTitle("📖 Help Menu")
            .setDescription("Here are all the available commands:")
            .setColor("Random")
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        const chunkSize = 1024; // tối đa ký tự cho mỗi field
        let tempStr = "";

        for (const file of commandFiles) {
            if (file === "help.js") continue; // bỏ qua file help
            try {
                const command = require(path.join(commandsPath, file));
                const name = command.data?.name || command.name || file;
                const description = command.data?.description || command.description || "No description";
                const line = `\`${name}\` - ${description}\n`;

                if ((tempStr + line).length > chunkSize) {
                    embed.addFields({ name: "\u200b", value: tempStr });
                    tempStr = line;
                } else {
                    tempStr += line;
                }
            } catch {
                continue;
            }
        }

        if (tempStr) embed.addFields({ name: "\u200b", value: tempStr });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};