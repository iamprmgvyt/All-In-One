const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search information from the web')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Search query')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const SERP_API_KEY = process.env.SERP_API_KEY;
        if (!SERP_API_KEY) return interaction.reply({ content: '❌ SERP API key not set in .env', ephemeral: true });

        await interaction.deferReply();

        try {
            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERP_API_KEY}&num=3`;
            const res = await fetch(url);
            const data = await res.json();

            let output = '';
            if (data.organic_results && data.organic_results.length > 0) {
                data.organic_results.forEach((item, i) => {
                    output += `**${i+1}. ${item.title}**\n${item.link}\n${item.snippet || ''}\n\n`;
                });
            } else {
                output = 'No results found.';
            }

            interaction.editReply({ content: output });
        } catch (err) {
            console.error(err);
            interaction.editReply({ content: '❌ Error fetching search results.' });
        }
    }
};