const config = require('../config');

function getOwners() {
  const fromEnv = (config.owners || []).filter(Boolean);
  const hardcoded = config.ownerIds || [];
  return [...new Set([...hardcoded, ...fromEnv].map(String))];
}

function isOwner(userId) {
  return getOwners().includes(String(userId));
}

function canConfigure(member) {
  if (!member) return false;
  if (isOwner(member.id)) return true;
  return member.permissions?.has?.('ManageGuild') || member.permissions?.has?.('Administrator');
}

function canModerate(member) {
  if (!member) return false;
  if (isOwner(member.id)) return true;
  return (
    member.permissions?.has?.('ManageMessages') ||
    member.permissions?.has?.('ModerateMembers') ||
    member.permissions?.has?.('Administrator')
  );
}

module.exports = { getOwners, isOwner, canConfigure, canModerate };
