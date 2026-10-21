const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const { canConfigure, isOwner } = require('../../utils/permissions');

module.exports = {
  name: 'ticketpanel',
  aliases: ['ticket', 'supportpanel'],
  description: 'Post the support ticket panel or manage tickets',
  async execute(message, args, client) {
    const sub = args[0]?.toLowerCase();
    const gcfg = client.guildConfig.get(message.guild.id);
    const staffRoleId = gcfg.staffRoleId || config.tickets.staffRoleId;

    if (sub === 'close') {
      if (!message.channel.name.startsWith('ticket-')) {
        return message.reply({ embeds: [{ color: config.colors.error, description: 'Only in a ticket channel.' }] });
      }
      await message.reply({ embeds: [{ color: config.colors.warning, title: 'Closing', description: 'Deleted in 5s...' }] });
      setTimeout(() => message.channel.delete().catch(() => {}), 5000);
      return;
    }

    if (sub === 'add') {
      const user = message.mentions.users.first();
      if (!user || !message.channel.name.startsWith('ticket-')) {
        return message.reply({ embeds: [{ color: config.colors.error, description: '`!ticket add @user` in a ticket' }] });
      }
      await message.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
      return message.reply({ embeds: [{ color: config.colors.success, description: `Added ${user}` }] });
    }

    if (sub === 'remove') {
      const user = message.mentions.users.first();
      if (!user || !message.channel.name.startsWith('ticket-')) {
        return message.reply({ embeds: [{ color: config.colors.error, description: '`!ticket remove @user` in a ticket' }] });
      }
      await message.channel.permissionOverwrites.delete(user.id);
      return message.reply({ embeds: [{ color: config.colors.success, description: `Removed ${user}` }] });
    }

    if (!canConfigure(message.member) && !isOwner(message.author.id)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: 'Manage Server or bot owner required.' }] });
    }

    if (!staffRoleId) {
      return message.reply({ embeds: [{ color: config.colors.warning, title: 'Staff role not set', description: 'Run `!config set staff @Support` then `!ticketpanel`.' }] });
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.ticket)
      .setTitle('BoostVault Support')
      .setDescription('Click the button to open a private ticket.\n\nTechnical support, account, partnerships, reports.')
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_create').setLabel('Open a Ticket').setEmoji('🎫').setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    if (message.deletable) message.delete().catch(() => {});
  }
};
