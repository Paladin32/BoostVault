const { Events } = require('discord.js');
const config = require('../config');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // Counting system
    const handled = await client.counting.handleMessage(message);
    if (handled) return;

    // Prefix commands
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
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
