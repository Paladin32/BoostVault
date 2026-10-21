const { Events } = require('discord.js');
const globalConfig = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const handled = await client.counting.handleMessage(message);
    if (handled) return;

    const gcfg = client.guildConfig.get(message.guild.id);
    const prefix = gcfg.prefix || globalConfig.prefix || '!';

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`Error in command ${commandName}:`, error);
      message.reply({
        embeds: [{
          color: 0xED4245,
          title: '❌ Error',
          description: 'An error occurred while executing this command.'
        }]
      }).catch(() => {});
    }
  }
};
