const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'poll',
  description: 'Create a quick poll',
  usage: '!poll <question>',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply({ embeds: [{ color: config.colors.warning, description: `Usage: \`${config.prefix}poll <question>\`` }] });
    }
    const question = args.join(' ');
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('📊 Poll')
      .setDescription(question)
      .setFooter({ text: `Poll by ${message.author.tag} • React to vote` })
      .setTimestamp();
    const pollMsg = await message.channel.send({ embeds: [embed] });
    await pollMsg.react('👍');
    await pollMsg.react('👎');
    if (message.deletable) message.delete().catch(() => {});
  }
};
