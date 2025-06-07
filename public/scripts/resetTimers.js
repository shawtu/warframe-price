// timers.js

// --- Utility Functions ---

/**
 * Returns the next daily reset time (00:00 UTC) as a Date object.
 */
export function getNextUtcMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(0, 0, 0, 0);
  if (now >= next) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

/**
 * Returns the next weekly reset time (Monday 00:00 UTC) as a Date object.
 */
export function getNextUtcMondayMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(0, 0, 0, 0);
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  next.setUTCDate(next.getUTCDate() + daysUntilMonday);
  return next;
}

/**
 * Formats milliseconds as "Xd Xh Xm Xs" dropping leading zeros.
 * e.g. "2d 4h 33m 10s", "4h 10s", "33m 5s", "7s"
 */
export function formatCountdown(ms) {
  if (ms <= 0) return "Expired";
  let totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds -= days * 86400;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds -= hours * 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let parts = [];
  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (minutes) parts.push(minutes + "m");
  // Always show seconds unless timer is expired
  if (seconds || parts.length === 0) parts.push(seconds + "s");
  return parts.join(" ");
}

/**
 * Parses an eta/timeLeft string like "1h 22m 13s" to milliseconds.
 */
function parseEtaToMs(eta) {
  if (!eta) return 0;
  let totalMs = 0;
  const regex = /(\d+)\s*h|(\d+)\s*m|(\d+)\s*s/g;
  let match;
  while ((match = regex.exec(eta)) !== null) {
    if (match[1]) totalMs += parseInt(match[1]) * 3600 * 1000;
    if (match[2]) totalMs += parseInt(match[2]) * 60 * 1000;
    if (match[3]) totalMs += parseInt(match[3]) * 1000;
  }
  return totalMs;
}

// --- Timer Starters ---

let resetTimersInterval = null;
/**
 * Starts and updates the daily and weekly reset timers in the DOM.
 * Expects elements with IDs 'daily-reset-timer' and 'weekly-reset-timer'.
 * Uses formatCountdown for display.
 */
export function startResetTimers() {
  function updateResetTimers() {
    const now = new Date();
    const dailyReset = getNextUtcMidnight();
    const dailyMs = dailyReset - now;
    const dailyTimer = document.getElementById('daily-reset-timer');
    if (dailyTimer)
      dailyTimer.textContent =
        dailyMs > 0 ? `Resets in ${formatCountdown(dailyMs)}` : 'Resetting...';

    const weeklyReset = getNextUtcMondayMidnight();
    const weeklyMs = weeklyReset - now;
    const weeklyTimer = document.getElementById('weekly-reset-timer');
    if (weeklyTimer)
      weeklyTimer.textContent =
        weeklyMs > 0
          ? `Resets in ${formatCountdown(weeklyMs)}`
          : 'Resetting...';
  }
  if (resetTimersInterval) clearInterval(resetTimersInterval);
  resetTimersInterval = setInterval(updateResetTimers, 1000);
  updateResetTimers();
}

let missionCountdownsInterval = null;
/**
 * Starts and updates mission countdown timers in the DOM.
 * Missions may have either:
 *   - expiresAt (timestamp ms or ISO string)
 *   - OR timeLeft/eta (string from API, e.g. "1h 22m 13s")
 * This function will calculate and cache expiration per mission.
 * @param {Array} missions - Array of missions.
 */
export function startMissionCountdowns(missions) {
  // We'll store expiration times here to avoid recalculating every tick
  const expirationCache = new WeakMap();

  function getExpiration(mission) {
    // Prefer expiresAt if set and valid
    if (mission.expiresAt && !isNaN(mission.expiresAt)) return mission.expiresAt;

    // Cache computed expiresAt if possible
    if (expirationCache.has(mission)) return expirationCache.get(mission);

    // Try to use timeLeft or eta
    const eta = mission.timeLeft || mission.eta;
    if (typeof eta === "string" && eta.trim()) {
      const expiresAt = Date.now() + parseEtaToMs(eta);
      expirationCache.set(mission, expiresAt);
      return expiresAt;
    }
    return null;
  }

  function updateTimers() {
    const now = Date.now();
    missions.forEach((mission, i) => {
      const timerElem = document.getElementById(`mission-timer-${i}`);
      if (!timerElem) return;
      const expiresAt = getExpiration(mission);
      if (!expiresAt || isNaN(expiresAt)) {
        timerElem.textContent = "-";
        return;
      }
      const msLeft = expiresAt - now;
      timerElem.textContent = formatCountdown(msLeft);
    });
  }
  if (missionCountdownsInterval) clearInterval(missionCountdownsInterval);
  missionCountdownsInterval = setInterval(updateTimers, 1000);
  updateTimers();
}