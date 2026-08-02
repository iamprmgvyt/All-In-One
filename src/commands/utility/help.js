// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('✨ Display dynamic interactive command menu with rich embeds, emojis, and full listings')
    .addStringOption(opt => opt.setName('category').setDescription('Specific category to inspect')),
  aliases: ['commands', 'menu', 'h'],

  async execute(ctx) {
    const selectedCategoryInput = ctx.isSlash ? ctx.interaction.options.getString('category') : ctx.args[0];

    // Group commands by category dynamically
    const categoriesMap = new Map();
    ctx.client.slashCommands.forEach(cmd => {
      const cat = cmd.category || 'General';
      if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
      categoriesMap.get(cat).push(cmd);
    });

    if (selectedCategoryInput) {
      const matchedCategoryKey = Array.from(categoriesMap.keys()).find(
        k => k.toLowerCase() === selectedCategoryInput.toLowerCase()
      );

      if (matchedCategoryKey) {
        const embed = this.createCategoryEmbed(matchedCategoryKey, categoriesMap.get(matchedCategoryKey));
        return ctx.reply({ embeds: [embed] });
      }
    }

    const totalCommandsCount = ctx.client.slashCommands.size;

    const mainEmbed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle('⚡ ALL-IN-ONE (AIO) DISCORD BOT FRAMEWORK v1.1.0')
      .setDescription(
        `👑 **Author**: \`prmgvyt\` | 🚀 **Framework**: \`Discord.js v14\`\n` +
        `📦 **Total Modules**: **${totalCommandsCount}** (Mapped into **1,200 Executable Routes** via Slash `/` & Prefix `!`)\n\n` +
        `📌 *Select a category from the dropdown menu below to view the full command suite!*`
      )
      .setFooter({ text: 'All-In-One Framework | Made by prmgvyt', iconURL: ctx.client.user.displayAvatarURL() })
      .setTimestamp();

    categoriesMap.forEach((cmds, catName) => {
      const commandNames = cmds.map(c => `\`${c.data.name}\``).join('  ');
      mainEmbed.addFields({
        name: `📁 ${catName} (${cmds.length} modules)`,
        value: commandNames || 'No commands',
        inline: false
      });
    });

    const selectMenuOptions = [];
    categoriesMap.forEach((cmds, catName) => {
      selectMenuOptions.push({
        label: `${catName} (${cmds.length} commands)`,
        value: `help_cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        description: `Inspect full command details for ${catName}`
      });
    });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('✨ Choose a module category to inspect full commands...')
      .addOptions(selectMenuOptions.slice(0, 25));

    const rowMenu = new ActionRowBuilder().addComponents(menu);

    const rowButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🔗 Invite AIO Bot')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=8&scope=bot%20applications.commands`),
      new ButtonBuilder()
        .setLabel('🌐 Web Dashboard')
        .setStyle(ButtonStyle.Link)
        .setURL(`http://localhost:${config.dashboardPort || 3000}/dashboard.html`)
    );

    return ctx.reply({ embeds: [mainEmbed], components: [rowMenu, rowButtons] });
  },

  createCategoryEmbed(categoryName, commandsList) {
    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`📁 Module Category: ${categoryName}`)
      .setDescription(`Full list of **${commandsList.length}** executable commands in this category:\n`)
      .setFooter({ text: 'AIO Framework | Made by prmgvyt' })
      .setTimestamp();

    commandsList.forEach(cmd => {
      const aliasesStr = Array.isArray(cmd.aliases) && cmd.aliases.length > 0 ? `  *(Aliases: \`${cmd.aliases.join('`, `')}\`)*` : '';
      embed.addFields({
        name: `▶️ /${cmd.data.name}  |  !${cmd.data.name}`,
        value: `└ ${cmd.data.description || 'No description'}${aliasesStr}`,
        inline: false
      });
    });

    return embed;
  }
};
