const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dns = require('dns').promises;
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('domain')
        .setDescription('Check if a domain is valid, online, and safe.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Domain to check (e.g. example.com)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const domain = interaction.options.getString('url');

        await interaction.deferReply();

        let ip = null;
        let status = '❌ Offline';
        let safe = '⚠️ Not Checked';

        // B1: DNS lookup
        try {
            const addresses = await dns.resolve(domain);
            ip = addresses[0];
        } catch {
            return interaction.editReply(`❌ Domain **${domain}** not found.`);
        }

        // B2: HTTP status check
        try {
            const res = await fetch(`http://${domain}`, { method: 'HEAD', timeout: 5000 });
            status = res.ok ? `✅ Online (Status ${res.status})` : `⚠️ Error (Status ${res.status})`;
        } catch {
            status = '❌ No HTTP response';
        }

        // B3: Safety check (Google Safe Browsing API cần API key trong .env)
        try {
            if (process.env.GOOGLE_SAFE_BROWSING_KEY) {
                const safeRes = await fetch(
                    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            client: { clientId: "discord-bot", clientVersion: "1.0.0" },
                            threatInfo: {
                                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                                platformTypes: ["ANY_PLATFORM"],
                                threatEntryTypes: ["URL"],
                                threatEntries: [{ url: `http://${domain}` }]
                            }
                        })
                    }
                );

                const data = await safeRes.json();
                if (data.matches) {
                    safe = "❌ Unsafe (Reported by Google)";
                } else {
                    safe = "✅ Safe (No threats found)";
                }
            } else {
                safe = "⚠️ Skipped (No API key)";
            }
        } catch {
            safe = "⚠️ Safety check failed";
        }

        // B4: Trả kết quả embed
        const embed = new EmbedBuilder()
            .setTitle(`🌐 Domain Check: ${domain}`)
            .addFields(
                { name: "IP Address", value: ip || "N/A", inline: true },
                { name: "Status", value: status, inline: true },
                { name: "Safety", value: safe, inline: true }
            )
            .setColor(safe.includes('❌') ? 0xFF0000 : 0x00FF00);

        return interaction.editReply({ embeds: [embed] });
    }
};
