const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');
const config = require('../config');

const DATA_PATH = path.join(__dirname, '..', 'data', 'giveaways.json');

class GiveawayManager {
  constructor(client) {
    this.client = client;
    this.giveaways = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_PATH)) {
        this.giveaways = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
      }
    } catch (e) {
      this.giveaways = [];
    }
  }

  save() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(this.giveaways, null, 2));
  }

  init() {
    setInterval(() => this.checkEnded(), config.giveaway.checkInterval);
    console.log(`Giveaway Manager initialized (${this.giveaways.filter(g => !g.ended).length} active)`);
  }

  async start(channel, options) {
    const { prize, duration, winnerCount, hostId, hostTag } = options;
    const endAt = Date.now() + duration;

    const embed = new EmbedBuilder()
      .setColor(config.colors.giveaway)
      .setTitle('GIVEAWAY')
      .setDescription(
        `**Prize:** ${prize}\n` +
        `**Winners:** ${winnerCount}\n` +
        `**Hosted by:** <@${hostId}>\n` +
        `**Ends:** <t:${Math.floor(endAt / 1000)}:R> (<t:${Math.floor(endAt / 1000)}:f>)\n\n` +
        `Click the button below to enter!`
      )
      .setFooter({ text: `BoostVault • ${winnerCount} winner(s)` })
      .setTimestamp(endAt);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('giveaway_enter')
        .setLabel('Enter Giveaway')
        .setEmoji('🎉')
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await channel.send({ embeds: [embed], components: [row] });

    const giveaway = {
      messageId: msg.id,
      channelId: channel.id,
      guildId: channel.guild.id,
      prize,
      winnerCount,
      hostId,
      hostTag,
      endAt,
      ended: false,
      participants: []
    };

    this.giveaways.push(giveaway);
    this.save();
    return giveaway;
  }

  async enter(interaction) {
    const gw = this.giveaways.find(g => g.messageId === interaction.message.id && !g.ended);
    if (!gw) {
      return interaction.reply({ content: 'This giveaway has ended or does not exist.', ephemeral: true });
    }

    if (gw.participants.includes(interaction.user.id)) {
      return interaction.reply({ content: 'You already entered this giveaway!', ephemeral: true });
    }

    gw.participants.push(interaction.user.id);
    this.save();

    const embed = EmbedBuilder.from(interaction.message.embeds[0]);
    let newDesc = embed.data.description;
    if (!newDesc.includes('Entries:')) {
      newDesc += `\n**Entries:** ${gw.participants.length}`;
    } else {
      newDesc = newDesc.replace(/\*\*Entries:\*\* \d+/, `**Entries:** ${gw.participants.length}`);
    }
    embed.setDescription(newDesc);

    await interaction.message.edit({ embeds: [embed] });
    return interaction.reply({ content: `You entered the giveaway for **${gw.prize}**!`, ephemeral: true });
  }

  async checkEnded() {
    const now = Date.now();
    for (const gw of this.giveaways.filter(g => !g.ended && g.endAt <= now)) {
      await this.end(gw);
    }
  }

  async end(gw) {
    gw.ended = true;
    this.save();

    const channel = await this.client.channels.fetch(gw.channelId).catch(() => null);
    if (!channel) return;

    const msg = await channel.messages.fetch(gw.messageId).catch(() => null);
    if (!msg) return;

    let winners = [];
    if (gw.participants.length > 0) {
      const shuffled = [...gw.participants].sort(() => 0.5 - Math.random());
      winners = shuffled.slice(0, Math.min(gw.winnerCount, shuffled.length));
    }

    const winnerMentions = winners.length > 0
      ? winners.map(id => `<@${id}>`).join(', ')
      : 'No valid participants';

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('GIVEAWAY ENDED')
      .setDescription(
        `**Prize:** ${gw.prize}\n` +
        `**Winners:** ${winnerMentions}\n` +
        `**Hosted by:** <@${gw.hostId}>\n` +
        `**Participants:** ${gw.participants.length}`
      )
      .setFooter({ text: 'BoostVault Management Bot' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('giveaway_ended')
        .setLabel('Giveaway Ended')
        .setEmoji('🏁')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    await msg.edit({ embeds: [embed], components: [row] });

    if (winners.length > 0) {
      await channel.send({
        content: `Congratulations ${winnerMentions}! You won **${gw.prize}**!`,
        allowedMentions: { users: winners }
      });
    } else {
      await channel.send({ embeds: [new EmbedBuilder()
        .setColor(config.colors.warning)
        .setDescription('No one entered the giveaway.')
      ]});
    }
  }

  async reroll(messageId) {
    const gw = this.giveaways.find(g => g.messageId === messageId && g.ended);
    if (!gw) return null;
    if (gw.participants.length === 0) return [];
    const shuffled = [...gw.participants].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(gw.winnerCount, shuffled.length));
  }
}

module.exports = GiveawayManager;
