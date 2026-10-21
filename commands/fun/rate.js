const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'rate',
  description: 'Rate something out of 10',
  usage: '!rate <thing>',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply({ embeds: [{ color: config.colors.warning, description: `Usage: \`${config.prefix}rate <thing>\`` }] });
    }
    const thing = args.join(' ');
    let hash = 0;
    for (let i = 0; i < thing.length; i++) hash = thing.charCodeAt(i) + ((hash << 5) - hash);
    const rating = Math.abs(hash % 11);
    const bars = '█'.repeat(rating) + '░'.repeat(10 - rating);
    const embed = new EmbedBuilder()
      .setColor(config.colors.fun)
      .setTitle('⭐ Rating')
      .setDescription(`I rate **${thing}** a **${rating}/10**\n\`${bars}\``)
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  }
};
