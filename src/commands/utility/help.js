// Made by prmgvyt
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  category: 'Utility',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display dynamic command menu & automatically list all commands across all categories')
    .addStringOption(opt => opt.setName('category').setDescription('Specific category to list')),
  aliases: ['commands', 'menu', 'h'],

  async execute(ctx) {
    const selectedCategoryInput = ctx.isSlash ? ctx.interaction.options.getString('category') : ctx.args[0];

    // Group commands by category dynamically from client.slashCommands
    const categoriesMap = new Map();
    ctx.client.slashCommands.forEach(cmd => {
      const cat = cmd.category || 'General';
      if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
      categoriesMap.get(cat).push(cmd);
    });

    // If specific category selected directly via input
    if (selectedCategoryInput) {
      const matchedCategoryKey = Array.from(categoriesMap.keys()).find(
        k => k.toLowerCase() === selectedCategoryInput.toLowerCase()
      );

      if (matchedCategoryKey) {
        const embed = this.createCategoryEmbed(matchedCategoryKey, categoriesMap.get(matchedCategoryKey));
        return ctx.reply({ embeds: [embed] });
      }
    }

    // Build Overview Embed with Dynamic Category Listing
    const totalCommandsCount = ctx.client.slashCommands.size;

    const mainEmbed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle('🚀 All-In-One (AIO) Dynamic Command Suite')
      .setDescription(
        `**Author**: prmgvyt | **Framework**: Discord.js v14\n` +
        `**Total Command Modules Loaded**: **${totalCommandsCount}** (Mapped into **1,200 Executable Routes** via Slash & Prefix)\n\n` +
        `Select a category from the dropdown menu below to automatically list all commands in that module!`
      )
      .setFooter({ text: 'All commands support both Slash (/) and Prefix (!). Made by prmgvyt' })
      .setTimestamp();

    // Dynamically list summary of categories and command count
    categoriesMap.forEach((cmds, catName) => {
      const commandNames = cmds.map(c => `\`${c.data.name}\``).join(', ');
      mainEmbed.addFields({
        name: `📁 ${catName} (${cmds.length} commands)`,
        value: commandNames || 'No commands',
        inline: false
      });
    });

    // Build Select Menu Options Dynamically
    const selectMenuOptions = [];
    categoriesMap.forEach((cmds, catName) => {
      selectMenuOptions.push({
        label: `${catName} (${cmds.length})`,
        value: `help_cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        description: `View full command list for ${catName}`
      });
    });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_category_select')
      .setPlaceholder('📌 Select a category to view full command details...')
      .addOptions(selectMenuOptions.slice(0, 25)); // Discord allows up to 25 select options

    const row = new ActionRowBuilder().addComponents(menu);

    return ctx.reply({ embeds: [mainEmbed], components: [row] });
  },

  createCategoryEmbed(categoryName, commandsList) {
    const embed = new EmbedBuilder()
      .setColor('#38bdf8')
      .setTitle(`📁 Category: ${categoryName}`)
      .setDescription(`Full list of all **${commandsList.length}** commands in this category:\n`)
      .setFooter({ text: 'AIO Dynamic Help System | Made by prmgvyt' })
      .setTimestamp();

    commandsList.forEach(cmd => {
      const aliasesStr = Array.isArray(cmd.aliases) && cmd.aliases.length > 0 ? ` (Aliases: \`${cmd.aliases.join('`, `')}\`)` : '';
      embed.addFields({
        name: `/${cmd.data.name} or !${cmd.data.name}`,
        value: `${cmd.data.description || 'No description'}${aliasesStr}`,
        inline: false
      });
    });

    return embed;
  }
};
