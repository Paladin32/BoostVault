require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  prefix: process.env.PREFIX || '!',

  ownerIds: [
    '1264183250243420211',
    '1436438785159073893',
    ...(process.env.OWNER_ID ? [process.env.OWNER_ID] : [])
  ],

  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    error: 0xED4245,
    warning: 0xFEE75C,
    giveaway: 0xEB459E,
    ticket: 0x5865F2,
    fun: 0x57F287
  },

  tickets: {
    staffRoleId: process.env.STAFF_ROLE_ID || null,
    categoryId: process.env.TICKET_CATEGORY_ID || null,
    logChannelId: process.env.LOG_CHANNEL_ID || null,
    maxTicketsPerUser: 1
  },

  giveaway: {
    defaultEmoji: '🎉',
    checkInterval: 5000
  }
};
