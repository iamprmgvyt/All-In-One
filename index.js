require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType, ButtonStyle, ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const { stripIndents } = require('common-tags');
const ordinal = require('ordinal');
const humanizeNumber = require('humanize-number');
const moment = require('moment');
const mongoose = require('mongoose');

// --- Environment Setup ---
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGO_URI = process.env.MONGODB;

// --- Create Client ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildBans // Required for tracking bans
    ]
});

// --- Connect to MongoDB ---
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Load Commands ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Command ${command.data.name} loaded`);
        } else {
            console.log(`⚠️ Skipped invalid command file: ${file}`);
        }
    } catch (err) {
        console.error(`❌ Error loading command ${file}:`, err);
    }
}

// --- Ready Event ---
client.once('ready', () => {
    console.log(`${client.user.tag} is ready!`);

    // Set the bot's presence
    client.user.setPresence({
        activities: [
            {
                name: 'https://iamprmgvyt.github.io/AllInOneWeb/', // Replace with what you want the bot to display
                type: ActivityType.Watching // Can be Watching, Listening, etc.
            }
        ],
        status: 'dnd' // Can be 'online', 'idle', 'dnd', or 'invisible'
    });
});

// --- Interaction Create ---
client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(`❌ Error executing command ${interaction.commandName}:`, err);
            if (!interaction.replied) {
                await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
            }
        }
    }

    // Additional interaction handling for buttons can go here...
});

// --- Register Slash Commands ---
(async () => {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    const commands = client.commands.map(cmd => cmd.data.toJSON()); // Convert command data to JSON format

    try {
        console.log('📢 Registering slash commands...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('✅ Slash commands registered successfully!');
        console.log(`Total commands: ${client.commands.size}`);
    } catch (err) {
        console.error('❌ Error registering commands:', err);
    }
})();

// --- Login ---
client.login(TOKEN);