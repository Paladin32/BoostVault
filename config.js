require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  prefix: process.env.PREFIX || '!',
  ownerId: process.env.OWNER_ID,

  // Colors for embeds
  colors: {
    primary: 0x5865F2,      // Discord blurple
    success: 0x57F287,      // Green
    error: 0xED4245,        // Red
    warning: 0xFEE75C,      // Yellow
    giveaway: 0xEB459E,     // Pink/Fuchsia
    ticket: 0x5865F2,
    fun: 0x57F287
  },

  // Ticket settings
  tickets: {
    staffRoleId: process.env.STAFF_ROLE_ID || null,
    categoryId: process.env.TICKET_CATEGORY_ID || null,
    logChannelId: process.env.LOG_CHANNEL_ID || null,
    maxTicketsPerUser: 1
  },

  // Giveaway defaults
  giveaway: {
    defaultEmoji: '🎉',
    checkInterval: 5000 // ms
  }
};
