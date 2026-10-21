const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'avatar',
  aliases: ['av', 'pfp'],
  description: 'Show user avatar',
  usage: '!avatar [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() ||
      (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) ||
      message.author;
    const url = user.displayAvatarURL({ size: 4096, extension: 'png' });
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(`🖼️ Avatar — ${user.tag}`)
      .setImage(url)
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Open in Browser')
        .setStyle(ButtonStyle.Link)
        .setURL(url)
    );
    await message.reply({ embeds: [embed], components: [row] });
  }
};
