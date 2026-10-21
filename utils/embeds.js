const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function baseEmbed() {
  return new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTimestamp()
    .setFooter({ text: 'BoostVault Management Bot' });
}

function successEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description);
}

function errorEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description);
}

function warningEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.warning)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description);
}

function giveawayEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.giveaway)
    .setTitle(`🎉 ${title}`)
    .setDescription(description);
}

function ticketEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.ticket)
    .setTitle(`🎫 ${title}`)
    .setDescription(description);
}

function funEmbed(title, description) {
  return baseEmbed()
    .setColor(config.colors.fun)
    .setTitle(title)
    .setDescription(description);
}

module.exports = {
  baseEmbed,
  successEmbed,
  errorEmbed,
  warningEmbed,
  giveawayEmbed,
  ticketEmbed,
  funEmbed
};
