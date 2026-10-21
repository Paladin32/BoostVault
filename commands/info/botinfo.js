const { EmbedBuilder, version: djsVersion } = require('discord.js');
const config = require('../../config');
const os = require('os');

module.exports = {
  name: 'botinfo',
  aliases: ['bot', 'stats', 'about'],
  description: 'Show bot information',
  async execute(message, args, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🤖 BoostVault Management Bot')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, inline: true },
        { name: 'Channels', value: `${client.channels.cache.size}`, inline: true },
        { name: 'Uptime', value: uptimeStr, inline: true },
        { name: 'Memory', value: `${mem} MB`, inline: true },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Discord.js', value: `v${djsVersion}`, inline: true },
        { name: 'Prefix', value: `\`${config.prefix}\``, inline: true }
      )
      .setFooter({ text: 'BoostVault Management Bot • Made for BoostVault' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
