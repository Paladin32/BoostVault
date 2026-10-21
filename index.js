const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config');
const { loadCommands, loadEvents } = require('./handlers/loader');
const GiveawayManager = require('./utils/GiveawayManager');
const CountingManager = require('./utils/CountingManager');

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

// Collections
client.commands = new Collection();
client.buttons = new Collection();
client.config = config;

// Managers
client.giveaways = new GiveawayManager(client);
client.counting = new CountingManager(client);

// Load handlers
loadCommands(client);
loadEvents(client);

// Ready
client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online!`);
  console.log(`📌 Prefix: ${config.prefix}`);
  console.log(`🏠 Servers: ${client.guilds.cache.size}`);
  client.user.setActivity('!help | BoostVault', { type: 3 }); // Watching
  client.giveaways.init();
});

// Login
client.login(config.token).catch(err => {
  console.error('❌ Failed to login. Check your TOKEN in .env');
  console.error(err);
  process.exit(1);
});
