// commands/announce.js
const { SlashCommandBuilder, WebhookClient } = require("discord.js");

// Put your webhook URL here
const webhookURL = "https://discord.com/api/webhooks/1407058408896598067/Ki-fgAzLP0ooM4UU9UR3Fuh0QbcM7su3qet7rDBmdmNZuwn6DXCPCEpJk8sUNQfPBo_7";
const webhookClient = new WebhookClient({ url: webhookURL });

// Replace with your Discord user ID (the bot owner)
const ownerId = "1262304052361035857"; // example, change to yours

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send an announcement through the webhook (Owner only)")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The announcement text")
                .setRequired(true)
        ),

    async execute(interaction) {
        // Check if the user is the owner
        if (interaction.user.id !== ownerId) {
            return interaction.reply({ 
                content: "❌ You are not allowed to use this command.", 
                ephemeral: true 
            });
        }

        const message = interaction.options.getString("message");

        try {
            await webhookClient.send({
                content: `📢 **Announcement:** ${message}`,
                username: "Announce Bot",
                avatarURL: "https://i.imgur.com/AfFp7pu.png"
            });

            await interaction.reply({ 
                content: "✅ Announcement sent via webhook!", 
                ephemeral: true 
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({ 
                content: "❌ Failed to send announcement.", 
                ephemeral: true 
            });
        }
    }
};
