const { PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const config = require('../../config');

module.exports = {
  name: 'gstart',
  aliases: ['giveaway', 'gcreate'],
  description: 'Start a giveaway',
  usage: '!gstart <duration> <winners> <prize>',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages) &&
        !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply({
        embeds: [{
          color: config.colors.error,
          title: '❌ Permission Denied',
          description: 'You need **Manage Messages** permission to start giveaways.'
        }]
      });
    }

    if (args.length < 3) {
      return message.reply({
        embeds: [{
          color: config.colors.warning,
          title: '⚠️ Invalid Usage',
          description: `**Usage:** \`${config.prefix}gstart <duration> <winners> <prize>\`\n\n` +
            `**Examples:**\n` +
            `\`${config.prefix}gstart 1h 1 Nitro Classic\`\n` +
            `\`${config.prefix}gstart 30m 3 Discord Nitro\`\n` +
            `\`${config.prefix}gstart 1d 1 Role Reward\``
        }]
      });
    }

    const duration = ms(args[0]);
    if (!duration || duration < 10000) {
      return message.reply({
        embeds: [{
          color: config.colors.error,
          description: 'Invalid duration. Use formats like `10s`, `5m`, `1h`, `1d`.'
        }]
      });
    }

    const winnerCount = parseInt(args[1], 10);
    if (isNaN(winnerCount) || winnerCount < 1 || winnerCount > 20) {
      return message.reply({
        embeds: [{
          color: config.colors.error,
          description: 'Number of winners must be between 1 and 20.'
        }]
      });
    }

    const prize = args.slice(2).join(' ');

    try {
      await client.giveaways.start(message.channel, {
        prize,
        duration,
        winnerCount,
        hostId: message.author.id,
        hostTag: message.author.tag
      });

      if (message.deletable) message.delete().catch(() => {});
    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [{
          color: config.colors.error,
          description: 'Failed to start the giveaway.'
        }]
      });
    }
  }
};
