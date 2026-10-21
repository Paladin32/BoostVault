const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'counting.json');

class CountingManager {
  constructor(client) {
    this.client = client;
    this.data = {}; // guildId -> { channelId, current, lastUserId }
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_PATH)) {
        this.data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      }
    } catch (e) {
      this.data = {};
    }
  }

  save() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.data, null, 2));
  }

  setChannel(guildId, channelId) {
    this.data[guildId] = {
      channelId,
      current: 0,
      lastUserId: null
    };
    this.save();
  }

  get(guildId) {
    return this.data[guildId] || null;
  }

  async handleMessage(message) {
    const guildData = this.get(message.guild.id);
    if (!guildData || message.channel.id !== guildData.channelId) return false;

    // Ignore bots
    if (message.author.bot) return true;

    const content = message.content.trim();
    const number = parseInt(content, 10);

    // Not a pure number
    if (isNaN(number) || content !== String(number)) {
      await message.react('❌');
      return true;
    }

    // Same user twice in a row
    if (message.author.id === guildData.lastUserId) {
      await message.react('❌');
      await message.channel.send({
        embeds: [{
          color: 0xED4245,
          description: `❌ **${message.author.username}**, you can't count twice in a row!`
        }]
      });
      return true;
    }

    // Wrong number
    if (number !== guildData.current + 1) {
      const failedAt = guildData.current;
      guildData.current = 0;
      guildData.lastUserId = null;
      this.save();

      await message.react('❌');
      await message.channel.send({
        embeds: [{
          color: 0xED4245,
          title: '💥 Counting Failed!',
          description: `**${message.author.username}** ruined it at **${failedAt}**!\nThe next number is **1**.`
        }]
      });
      return true;
    }

    // Correct!
    guildData.current = number;
    guildData.lastUserId = message.author.id;
    this.save();

    await message.react('✅');

    // Milestone reactions
    if (number % 100 === 0) {
      await message.react('🎉');
      await message.channel.send({
        embeds: [{
          color: 0x57F287,
          description: `🎉 Milestone reached! **${number}** counted!`
        }]
      });
    }

    return true;
  }
}

module.exports = CountingManager;
