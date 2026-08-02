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
        .setName('remind')
        .setDescription('Set a reminder.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time until reminder (e.g., 10s, 5m, 1h)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Reminder message')
                .setRequired(true)
        ),

    async execute(interaction) {
        const timeInput = interaction.options.getString('time');
        const reminderText = interaction.options.getString('message');

        let ms;
        const timeValue = parseInt(timeInput.slice(0, -1)); // Extract the numeric part
        const timeUnit = timeInput.slice(-1); // Extract the unit (s/m/h)

        // Validate time input
        if (isNaN(timeValue) || timeValue <= 0) {
            return interaction.reply({ content: '❌ Invalid time value. Please provide a positive number.', ephemeral: true });
        }

        if (timeUnit === 's') ms = timeValue * 1000;
        else if (timeUnit === 'm') ms = timeValue * 60000;
        else if (timeUnit === 'h') ms = timeValue * 3600000;
        else return interaction.reply({ content: '❌ Invalid time format. Use s/m/h.', ephemeral: true });

        await interaction.reply({ content: `⏰ Reminder set for **${timeInput}**.`, ephemeral: true });

        // Check if the user can receive DMs
        if (!interaction.user.dmChannel) {
            await interaction.user.createDM(); // Create DM channel if it doesn't exist
        }

        setTimeout(async () => {
            try {
                await interaction.user.send(`🔔 Reminder: ${reminderText}`);
            } catch {
                interaction.followUp({ content: "⚠️ I couldn't send you a DM.", ephemeral: true }).catch(() => {});
            }
        }, ms);
    }
};
