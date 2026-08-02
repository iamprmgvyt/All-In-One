// Made by prmgvyt
const { PermissionsBitField } = require('discord.js');

class CommandContext {
  constructor({ interaction = null, message = null, args = [], client, i18n }) {
    this.interaction = interaction;
    this.message = message;
    this.args = args;
    this.client = client;
    this.i18n = i18n;

    this.isSlash = !!interaction;
    this.guild = interaction ? interaction.guild : message.guild;
    this.channel = interaction ? interaction.channel : message.channel;
    this.user = interaction ? interaction.user : message.author;
    this.member = interaction ? interaction.member : message.member;
  }

  hasPermission(permission) {
    if (!this.member) return false;
    return this.member.permissions.has(permission);
  }

  getOption(name) {
    if (this.isSlash) {
      const val = this.interaction.options.get(name);
      if (!val) return null;
      return val.value !== undefined ? val.value : (val.user || val.member || val.channel || val.role || val);
    } else {
      if (this.args.length === 0) return null;
      return this.args.join(' ');
    }
  }

  async reply(content) {
    if (this.isSlash) {
      if (this.interaction.replied || this.interaction.deferred) {
        return await this.interaction.followUp(content);
      }
      return await this.interaction.reply(content);
    } else {
      return await this.message.reply(content);
    }
  }

  async deferReply(ephemeral = false) {
    if (this.isSlash) {
      return await this.interaction.deferReply({ ephemeral });
    } else {
      return await this.channel.sendTyping();
    }
  }
}

module.exports = CommandContext;
