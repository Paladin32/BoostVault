const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  async execute(message, args, client) {
    const sent = await message.reply({
      embeds: [{
        color: config.colors.primary,
        title: '🏓 Pinging...'
      }]
    });

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `\`${latency}ms\``, inline: true },
        { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
      )
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();

    await sent.edit({ embeds: [embed] });
  }
};
