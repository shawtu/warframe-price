export function truncateReward(str, maxLen = 10) {
  return str && str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}