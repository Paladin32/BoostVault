const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'guilds.json');

const DEFAULTS = {
  prefix: '!',
  staffRoleId: null,
  ticketCategoryId: null,
  logChannelId: null,
  welcomeChannelId: null,
  modLogChannelId: null,
  maxTicketsPerUser: 1,
  ticketPanelMessage: null,
  giveawayRoleId: null,
  mutedRoleId: null
};

class GuildConfig {
  constructor() {
    this.data = {};
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
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.data, null, 2));
  }

  get(guildId) {
    if (!this.data[guildId]) {
      this.data[guildId] = { ...DEFAULTS };
      this.save();
    }
    for (const [k, v] of Object.entries(DEFAULTS)) {
      if (this.data[guildId][k] === undefined) this.data[guildId][k] = v;
    }
    return this.data[guildId];
  }

  set(guildId, key, value) {
    const g = this.get(guildId);
    g[key] = value;
    this.save();
    return g;
  }

  setMany(guildId, obj) {
    const g = this.get(guildId);
    Object.assign(g, obj);
    this.save();
    return g;
  }

  reset(guildId) {
    this.data[guildId] = { ...DEFAULTS };
    this.save();
    return this.data[guildId];
  }
}

module.exports = GuildConfig;
module.exports.DEFAULTS = DEFAULTS;
