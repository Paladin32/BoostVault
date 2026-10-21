const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'kick',
  description: 'Kick a member',
  usage: '!kick @user [reason]',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ You need **Kick Members** permission.' }] });
    }
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({ embeds: [{ color: config.colors.error, description: '❌ I need **Kick Members** permission.' }] });
    }

    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
    if (!member) {
      return message.reply({ embeds: [{ color: config.colors.warning, description: `Usage: \`${config.prefix}kick @user [reason]\`` }] });
    }
    if (member.id === message.author.id) {
      return message.reply({ embeds: [{ color: config.colors.error, description: 'You cannot kick yourself.' }] });
    }
    if (!member.kickable) {
      return message.reply({ embeds: [{ color: config.colors.error, description: 'I cannot kick this member (role hierarchy).' }] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.kick(`${message.author.tag}: ${reason}`);

    const embed = new EmbedBuilder()
      .setColor(config.colors.warning)
      .setTitle('👢 Member Kicked')
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
