const { EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  name: 'help',
  aliases: ['h', 'commands', 'cmds'],
  description: 'Shows all available commands',
  async execute(message, args, client) {
    const gcfg = client.guildConfig.get(message.guild.id);
    const p = gcfg.prefix || config.prefix || '!';

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🤖 BoostVault Management Bot')
      .setDescription(
        `Prefix: \`${p}\`\n` +
        `**Configure everything in Discord:** \`${p}config\`\n\n` +
        `Owners: <@1264183250243420211> · <@1436438785159073893>`
      )
      .addFields(
        { name: '⚙️ Configuration', value: `\`${p}config\` · \`${p}config set staff @role\` · \`${p}config set log #ch\` · \`${p}config set ticketcategory <id>\`` },
        { name: '🎫 Support', value: `\`${p}ticketpanel\` · \`${p}ticket close/add/remove\`` },
        { name: '🎉 Giveaways', value: `\`${p}gstart\` · \`${p}gend\` · \`${p}greroll\`` },
        { name: '🛡️ Moderation', value: `\`${p}ban\` · \`${p}kick\` · \`${p}timeout\` · \`${p}purge\` · \`${p}lock\`` },
        { name: '🎮 Fun', value: `\`${p}coinflip\` · \`${p}dice\` · \`${p}8ball\` · \`${p}rps\` · \`${p}counting\`` },
        { name: 'ℹ️ Info', value: `\`${p}serverinfo\` · \`${p}userinfo\` · \`${p}help\` · \`${p}ping\`` }
      )
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
