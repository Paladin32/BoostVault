const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  description: 'Get bot invite link',
  async execute(message, args, client) {
    const permissions = new PermissionsBitField([
      PermissionsBitField.Flags.Administrator
    ]).bitfield;

    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🔗 Invite BoostVault Bot')
      .setDescription('Click the button below to invite the bot to your server.')
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Invite Bot')
        .setStyle(ButtonStyle.Link)
        .setURL(inviteUrl)
        .setEmoji('🤖')
    );

    await message.reply({ embeds: [embed], components: [row] });
  }
};
