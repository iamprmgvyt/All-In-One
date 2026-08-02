// Made by prmgvyt
const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const giveawayManager = require('../../utils/giveawayManager');

module.exports = {
  category: 'Giveaway & Tickets',
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('🎁 Start a real-time giveaway event with timer, prize, winner count & role requirements')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addStringOption(opt => opt.setName('prize').setDescription('🏆 Prize title (e.g. Discord Nitro 1 Month)').setRequired(true))
    .addIntegerOption(opt => opt.setName('duration').setDescription('⏱️ Duration in minutes (e.g. 60)').setRequired(true))
    .addIntegerOption(opt => opt.setName('winners').setDescription('👥 Number of winners (e.g. 1)').setRequired(false))
    .addRoleOption(opt => opt.setName('required_role').setDescription('🔒 Required Role to enter (Optional)').setRequired(false)),
  aliases: ['giveawaystart', 'gcreate', 'giveaway'],

  async execute(ctx) {
    if (!ctx.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
      const errEmbed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle('⛔ Permission Denied')
        .setDescription('You need the **Manage Events** or **Administrator** permission to start giveaways.')
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' });
      return ctx.reply({ embeds: [errEmbed], ephemeral: true });
    }

    const prize = ctx.isSlash ? ctx.interaction.options.getString('prize') : ctx.args[0];
    const duration = ctx.isSlash ? ctx.interaction.options.getInteger('duration') : parseInt(ctx.args[1]);
    const winners = (ctx.isSlash ? ctx.interaction.options.getInteger('winners') : parseInt(ctx.args[2])) || 1;
    const requiredRole = ctx.isSlash ? ctx.interaction.options.getRole('required_role') : ctx.message.mentions.roles.first();

    if (!prize || !duration || isNaN(duration)) {
      const helpGuideEmbed = new EmbedBuilder()
        .setColor('#6366f1')
        .setTitle('🎁 How to Start a Giveaway')
        .setDescription(
          `**Slash Command Format:**\n` +
          `\`\`\`\n/gstart prize:<Prize Name> duration:<Minutes> winners:<Number> required_role:<Role>\n\`\`\`\n` +
          `**Prefix Command Format:**\n` +
          `\`\`\`\n!gstart <Prize_Name> <Duration_Minutes> [Winners_Count] [@RoleRequirement]\n\`\`\`\n` +
          `**Examples:**\n` +
          `• \`/gstart prize:Discord Nitro duration:60 winners:2\`\n` +
          `• \`!gstart Nitro_1Month 120 1 @VIP\`\n\n` +
          `💡 *Note: Use underscores for multi-word prizes in prefix mode (e.g. Nitro_1_Month).*`
        )
        .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' })
        .setTimestamp();

      return ctx.reply({ embeds: [helpGuideEmbed] });
    }

    const giveawayMsg = await giveawayManager.startGiveaway(
      ctx.channel,
      prize,
      duration,
      winners,
      ctx.user,
      requiredRole ? requiredRole.id : null
    );

    const successEmbed = new EmbedBuilder()
      .setColor('#10b981')
      .setTitle('🎉 Giveaway Created Successfully')
      .setDescription(`Started giveaway for **${prize}** in <#${ctx.channel.id}>!`)
      .addFields(
        { name: '⏱️ Duration', value: `\`${duration} minutes\``, inline: true },
        { name: '👥 Winner Count', value: `\`${winners}\``, inline: true },
        { name: '🔒 Required Role', value: requiredRole ? `${requiredRole}` : 'None', inline: true },
        { name: '🆔 Message ID', value: `\`${giveawayMsg.id}\``, inline: false }
      )
      .setFooter({ text: 'AIO Giveaway Suite | Made by prmgvyt' })
      .setTimestamp();

    if (ctx.isSlash) {
      await ctx.reply({ embeds: [successEmbed], ephemeral: true });
    } else {
      await ctx.reply({ embeds: [successEmbed] });
    }
  }
};
