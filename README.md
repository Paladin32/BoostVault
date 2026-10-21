# 🤖 BoostVault Management Bot

Complete Discord bot for **BoostVault** — Support Tickets, Giveaways, Moderation, Fun & Utility.

All commands use the prefix `!` and respond with **embeds** + **buttons**.

---

## ✨ Features

### 🎫 Support System
- Ticket panel with button
- Private ticket channels
- Claim / Close buttons
- Add / Remove users
- Logging support

### 🎉 Giveaways
- Button entry
- Auto end + winners
- Reroll
- Persistent storage

### 🛡️ Moderation
- Ban, Kick, Timeout / Untimeout
- Purge messages
- Slowmode, Lock / Unlock

### 🎮 Fun
- Coinflip, Dice, 8ball, RPS
- Rate, Ship, Joke
- Counting channel game

### ℹ️ Info & Utility
- Server / User / Bot info
- Avatar, Invite, Poll, Say

---

## 📦 Installation (local)

```bash
git clone https://github.com/Paladin32/BoostVault.git
cd BoostVault
npm install
cp .env.example .env
# Edit .env with your TOKEN
npm start
```

### Environment variables (`.env`)

```env
TOKEN=your_bot_token
CLIENT_ID=your_client_id
PREFIX=!
OWNER_ID=your_user_id

# Optional (tickets)
STAFF_ROLE_ID=
TICKET_CATEGORY_ID=
LOG_CHANNEL_ID=
```

**Required Discord Intents:** Message Content, Server Members (recommended).

---

## 🚂 Deploy on Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select repository `Paladin32/BoostVault`
3. Add variables in Railway:
   - `TOKEN` = your bot token
   - `CLIENT_ID` = your client id
   - `PREFIX` = `!`
   - (optional) `STAFF_ROLE_ID`, `TICKET_CATEGORY_ID`, `LOG_CHANNEL_ID`
4. Deploy. The start command is already set to `node index.js`.

Railway will keep the bot online. No port needed (worker process).

---

## 📜 Commands

| Category | Commands |
|----------|----------|
| **Support** | `!ticketpanel`, `!ticket close/add/remove` |
| **Giveaways** | `!gstart`, `!gend`, `!greroll` |
| **Moderation** | `!ban`, `!kick`, `!timeout`, `!untimeout`, `!purge`, `!slowmode`, `!lock`, `!unlock` |
| **Fun** | `!coinflip`, `!dice`, `!8ball`, `!rps`, `!rate`, `!ship`, `!joke`, `!counting` |
| **Info** | `!serverinfo`, `!userinfo`, `!avatar`, `!botinfo`, `!invite` |
| **Utility** | `!help`, `!ping`, `!poll`, `!say` |

Type `!help` or `!help moderation` for details.

### Giveaway example
```
!gstart 1h 1 Discord Nitro
!gstart 30m 3 Steam Key
```

---

## 📁 Structure

```
├── index.js
├── config.js
├── Procfile / railway.json
├── commands/
│   ├── fun/
│   ├── giveaway/
│   ├── moderation/
│   ├── support/
│   ├── info/
│   └── utility/
├── events/
├── handlers/
├── utils/
└── data/
```

---

Made for **BoostVault** 💜  
GitHub: https://github.com/Paladin32/BoostVault
