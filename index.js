const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config');
const { loadCommands, loadEvents } = require('./handlers/loader');
const GiveawayManager = require('./utils/GiveawayManager');
const CountingManager = require('./utils/CountingManager');
const GuildConfig = require('./utils/GuildConfig');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.buttons = new Collection();
client.config = config;
client.guildConfig = new GuildConfig();
client.giveaways = new GiveawayManager(client);
client.counting = new CountingManager(client);

loadCommands(client);
loadEvents(client);

client.once('ready', () => {
  console.log(`Online as ${client.user.tag}`);
  console.log(`Owners: ${config.ownerIds.join(', ')}`);
  client.user.setActivity('!help | !config', { type: 3 });
  client.giveaways.init();
});

client.login(config.token).catch(err => {
  console.error('Login failed - check TOKEN');
  console.error(err);
  process.exit(1);
});
