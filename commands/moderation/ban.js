const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'ban',
  description: 'Ban a member',
  usage: '!ban @user [reason]',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ You need **Ban Members** permission.' }] });
    }
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ I need **Ban Members** permission.' }] });
    }

    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!member) {
      return message.reply({ embeds: [{ color: config.colors.warning, description: `Usage: \`${config.prefix}ban @user [reason]\`` }] });
    }
    if (member.id === message.author.id) {
      return message.reply({ embeds: [{ color: config.colors.error, description: 'You cannot ban yourself.' }] });
    }
    if (!member.bannable) {
      return message.reply({ embeds: [{ color: config.colors.error, description: 'I cannot ban this member (role hierarchy).' }] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.ban({ reason: `${message.author.tag}: ${reason}` });

    const embed = new EmbedBuilder()
      .setColor(config.colors.error)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp()
      .setFooter({ text: 'BoostVault Management Bot' });

    await message.reply({ embeds: [embed] });
  }
};
