const { Events, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config');
const { ticketEmbed, successEmbed, errorEmbed } = require('../utils/embeds');

function warningEmbed(title, description) {
  return new EmbedBuilder().setColor(0xFEE75C).setTitle(`⚠️ ${title}`).setDescription(description).setTimestamp().setFooter({ text: 'BoostVault' });
}

function getTcfg(client, guildId) {
  const g = client.guildConfig.get(guildId);
  return {
    staffRoleId: g.staffRoleId || config.tickets.staffRoleId,
    categoryId: g.ticketCategoryId || config.tickets.categoryId,
    logChannelId: g.logChannelId || config.tickets.logChannelId,
    maxTickets: g.maxTicketsPerUser || 1
  };
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { customId } = interaction;

    if (customId === 'cfg_refresh') {
      const g = client.guildConfig.get(interaction.guild.id);
      const role = (id) => id ? `<@&${id}>` : '`Not set`';
      const ch = (id) => id ? `<#${id}>` : '`Not set`';
      const embed = new EmbedBuilder().setColor(config.colors.primary).setTitle('Server Configuration')
        .setDescription([`Prefix: \`${g.prefix || '!'}\``, `Staff: ${role(g.staffRoleId)}`, `Ticket category: \`${g.ticketCategoryId || 'Not set'}\``, `Log: ${ch(g.logChannelId)}`, `Mod log: ${ch(g.modLogChannelId)}`].join('\n'));
      return interaction.update({ embeds: [embed] });
    }
    if (customId === 'cfg_guide') {
      return interaction.reply({ ephemeral: true, embeds: [{ color: config.colors.primary, title: 'Setup', description: '`!config set staff @role`\n`!config set ticketcategory <id>`\n`!config set log #channel`\n`!ticketpanel`' }] });
    }
    if (customId === 'giveaway_enter') return client.giveaways.enter(interaction);

    if (customId === 'ticket_create') {
      const tcfg = getTcfg(client, interaction.guild.id);
      const member = interaction.member;
      const open = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText && c.topic?.includes(member.id) && c.name.startsWith('ticket-'));
      if (open.size >= tcfg.maxTickets) {
        return interaction.reply({ ephemeral: true, embeds: [errorEmbed('Limit', 'Too many open tickets.')] });
      }
      const overwrites = [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory] },
        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages] }
      ];
      if (tcfg.staffRoleId) overwrites.push({ id: tcfg.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory] });
      try {
        const channel = await interaction.guild.channels.create({
          name: `ticket-${member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)}`,
          type: ChannelType.GuildText,
          parent: tcfg.categoryId || null,
          permissionOverwrites: overwrites,
          topic: `Ticket opened by ${member.user.tag} (${member.id})`
        });
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('ticket_claim').setLabel('Claim').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('ticket_close').setLabel('Close').setStyle(ButtonStyle.Danger)
        );
        await channel.send({ content: tcfg.staffRoleId ? `<@&${tcfg.staffRoleId}>` : null, embeds: [ticketEmbed('Support Ticket', `Welcome ${member}! Describe your issue.`)], components: [row] });
        await interaction.reply({ ephemeral: true, embeds: [successEmbed('Created', `Ticket: ${channel}`)] });
        if (tcfg.logChannelId) {
          const logCh = await interaction.guild.channels.fetch(tcfg.logChannelId).catch(() => null);
          if (logCh) logCh.send({ embeds: [ticketEmbed('Opened', `${member.user.tag} → ${channel}`)] }).catch(() => {});
        }
      } catch (e) {
        console.error(e);
        await interaction.reply({ ephemeral: true, embeds: [errorEmbed('Error', 'Check bot permissions & !config')] });
      }
    }

    if (customId === 'ticket_claim') {
      const tcfg = getTcfg(client, interaction.guild.id);
      const { isOwner } = require('../utils/permissions');
      const ok = (tcfg.staffRoleId && interaction.member.roles.cache.has(tcfg.staffRoleId)) || interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || isOwner(interaction.user.id);
      if (!ok) return interaction.reply({ ephemeral: true, embeds: [errorEmbed('No permission', 'Staff only')] });
      const embed = EmbedBuilder.from(interaction.message.embeds[0]);
      embed.addFields({ name: 'Claimed by', value: `${interaction.user}`, inline: true });
      await interaction.message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_claim').setLabel(`Claimed by ${interaction.user.username}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
        new ButtonBuilder().setCustomId('ticket_close').setLabel('Close').setStyle(ButtonStyle.Danger)
      )] });
      await interaction.reply({ embeds: [successEmbed('Claimed', `${interaction.user} is handling this.`)] });
    }

    if (customId === 'ticket_close') {
      const tcfg = getTcfg(client, interaction.guild.id);
      const { isOwner } = require('../utils/permissions');
      const ok = (tcfg.staffRoleId && interaction.member.roles.cache.has(tcfg.staffRoleId)) || interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || interaction.channel.topic?.includes(interaction.user.id) || isOwner(interaction.user.id);
      if (!ok) return interaction.reply({ ephemeral: true, embeds: [errorEmbed('No permission', 'Cannot close')] });
      await interaction.reply({ embeds: [warningEmbed('Closing', 'Deleted in 5 seconds...')] });
      if (tcfg.logChannelId) {
        const logCh = await interaction.guild.channels.fetch(tcfg.logChannelId).catch(() => null);
        if (logCh) logCh.send({ embeds: [ticketEmbed('Closed', `${interaction.user.tag} closed ${interaction.channel.name}`)] }).catch(() => {});
      }
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
  }
};
