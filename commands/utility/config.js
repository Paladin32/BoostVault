const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const config = require('../../config');
const { isOwner, canConfigure } = require('../../utils/permissions');

function formatCfg(gcfg) {
  const role = (id) => (id ? `<@&${id}>` : '`Not set`');
  const ch = (id) => (id ? `<#${id}>` : '`Not set`');
  return [
    `**Prefix:** \`${gcfg.prefix || '!'}\``,
    `**Staff role:** ${role(gcfg.staffRoleId)}`,
    `**Ticket category:** ${gcfg.ticketCategoryId ? `\`${gcfg.ticketCategoryId}\`` : '`Not set`'}`,
    `**Log channel:** ${ch(gcfg.logChannelId)}`,
    `**Mod log:** ${ch(gcfg.modLogChannelId)}`,
    `**Welcome:** ${ch(gcfg.welcomeChannelId)}`,
    `**Max tickets / user:** \`${gcfg.maxTicketsPerUser ?? 1}\``
  ].join('\n');
}

module.exports = {
  name: 'config',
  aliases: ['setup', 'settings', 'cfg'],
  description: 'Configure the bot from Discord',
  async execute(message, args, client) {
    if (!canConfigure(message.member) && !isOwner(message.author.id)) {
      return message.reply({ embeds: [{ color: config.colors.error, title: '❌ Permission Denied', description: 'Bot owners or **Manage Server** only.' }] });
    }

    const guildId = message.guild.id;
    const gcfg = client.guildConfig.get(guildId);
    const sub = (args[0] || 'show').toLowerCase();

    if (sub === 'show' || sub === 'panel' || !args[0]) {
      const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle('⚙️ BoostVault — Server Configuration')
        .setDescription('Configure everything from Discord.\n\n' + formatCfg(gcfg))
        .addFields(
          { name: '📝 Commands', value: [
            '`!config set prefix <char>`',
            '`!config set staff @role`',
            '`!config set ticketcategory <id>`',
            '`!config set log #channel`',
            '`!config set modlog #channel`',
            '`!config set welcome #channel`',
            '`!config set maxtickets <1-10>`',
            '`!config reset` (owners only)'
          ].join('\n') },
          { name: '👑 Owners', value: config.ownerIds.map(id => `<@${id}>`).join(', ') }
        )
        .setFooter({ text: 'BoostVault Management Bot' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('cfg_refresh').setLabel('Refresh').setEmoji('🔄').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('cfg_guide').setLabel('Setup guide').setEmoji('📖').setStyle(ButtonStyle.Primary)
      );
      return message.reply({ embeds: [embed], components: [row] });
    }

    if (sub === 'reset') {
      if (!isOwner(message.author.id)) {
        return message.reply({ embeds: [{ color: config.colors.error, description: 'Only bot owners can reset.' }] });
      }
      client.guildConfig.reset(guildId);
      return message.reply({ embeds: [{ color: config.colors.success, title: '✅ Config reset' }] });
    }

    if (sub === 'set') {
      const key = (args[1] || '').toLowerCase();
      const rest = args.slice(2);

      if (key === 'prefix') {
        const p = rest[0];
        if (!p || p.length > 5) return message.reply({ embeds: [{ color: config.colors.error, description: 'Prefix 1-5 chars.' }] });
        client.guildConfig.set(guildId, 'prefix', p);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Prefix set to \`${p}\`` }] });
      }

      if (key === 'staff' || key === 'staffrole') {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(rest[0]);
        if (!role) return message.reply({ embeds: [{ color: config.colors.error, description: '`!config set staff @Support`' }] });
        client.guildConfig.set(guildId, 'staffRoleId', role.id);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Staff role: ${role}` }] });
      }

      if (['ticketcategory', 'category', 'ticketcat'].includes(key)) {
        let catId = rest[0];
        const mentioned = message.mentions.channels.first();
        if (mentioned) catId = mentioned.type === ChannelType.GuildCategory ? mentioned.id : (mentioned.parentId || mentioned.id);
        if (!catId) return message.reply({ embeds: [{ color: config.colors.error, description: 'Provide category ID.' }] });
        catId = String(catId).replace(/[<#>]/g, '');
        client.guildConfig.set(guildId, 'ticketCategoryId', catId);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Ticket category: \`${catId}\`` }] });
      }

      if (['log', 'logs', 'logchannel'].includes(key)) {
        const ch = message.mentions.channels.first() || message.guild.channels.cache.get(String(rest[0] || '').replace(/[<#>]/g, ''));
        if (!ch) return message.reply({ embeds: [{ color: config.colors.error, description: '`!config set log #logs`' }] });
        client.guildConfig.set(guildId, 'logChannelId', ch.id);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Log channel: ${ch}` }] });
      }

      if (['modlog', 'modlogs'].includes(key)) {
        const ch = message.mentions.channels.first() || message.guild.channels.cache.get(String(rest[0] || '').replace(/[<#>]/g, ''));
        if (!ch) return message.reply({ embeds: [{ color: config.colors.error, description: '`!config set modlog #mod-logs`' }] });
        client.guildConfig.set(guildId, 'modLogChannelId', ch.id);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Mod log: ${ch}` }] });
      }

      if (key === 'welcome') {
        const ch = message.mentions.channels.first() || message.guild.channels.cache.get(String(rest[0] || '').replace(/[<#>]/g, ''));
        if (!ch) return message.reply({ embeds: [{ color: config.colors.error, description: '`!config set welcome #welcome`' }] });
        client.guildConfig.set(guildId, 'welcomeChannelId', ch.id);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Welcome: ${ch}` }] });
      }

      if (['maxtickets', 'maxticket'].includes(key)) {
        const n = parseInt(rest[0], 10);
        if (isNaN(n) || n < 1 || n > 10) return message.reply({ embeds: [{ color: config.colors.error, description: '1-10' }] });
        client.guildConfig.set(guildId, 'maxTicketsPerUser', n);
        return message.reply({ embeds: [{ color: config.colors.success, description: `Max tickets: **${n}**` }] });
      }

      return message.reply({ embeds: [{ color: config.colors.error, description: 'Keys: prefix, staff, ticketcategory, log, modlog, welcome, maxtickets' }] });
    }

    return message.reply({ embeds: [{ color: config.colors.warning, description: 'Use `!config` or `!config set <key> <value>`.' }] });
  }
};
