const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'lock',
  description: 'Lock the current channel',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ You need **Manage Channels** permission.' }] });
    }

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false
    });

    const embed = new EmbedBuilder()
      .setColor(config.colors.error)
      .setTitle('🔒 Channel Locked')
      .setDescription(`${message.channel} has been locked by ${message.author}.`)
      .setTimestamp()
      .setFooter({ text: 'BoostVault Management Bot' });

    await message.reply({ embeds: [embed] });
  }
};
