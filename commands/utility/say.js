const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'say',
  aliases: ['embed'],
  description: 'Make the bot say something in an embed',
  usage: '!say <message>',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ You need **Manage Messages** permission.' }] });
    }
    if (!args.length) {
      return message.reply({ embeds: [{ color: config.colors.warning, description: `Usage: \`${config.prefix}say <message>\`` }] });
    }
    const content = args.join(' ');
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setDescription(content)
      .setFooter({ text: `Sent by ${message.author.tag}` })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
    if (message.deletable) message.delete().catch(() => {});
  }
};
