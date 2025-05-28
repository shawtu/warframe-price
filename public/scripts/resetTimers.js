// Utility to get the next daily reset (00:00 UTC)
function getNextUtcMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(0, 0, 0, 0);
  if (now >= next) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

// Utility to get the next weekly reset (Monday 00:00 UTC)
function getNextUtcMondayMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(0, 0, 0, 0);
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  next.setUTCDate(next.getUTCDate() + daysUntilMonday);
  return next;
}

// Utility to format the countdown
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Main function to start/reset timers
export function startResetTimers() {
  function updateResetTimers() {
    // Daily
    const now = new Date();
    const dailyReset = getNextUtcMidnight();
    const dailyMs = dailyReset - now;
    const dailyTimer = document.getElementById('daily-reset-timer');
    if (dailyTimer)
      dailyTimer.textContent =
        dailyMs > 0 ? `Resets in ${formatTime(dailyMs)}` : 'Resetting...';

    // Weekly (Monday 00:00 UTC)
    const weeklyReset = getNextUtcMondayMidnight();
    const weeklyMs = weeklyReset - now;
    const weeklyTimer = document.getElementById('weekly-reset-timer');
    if (weeklyTimer)
      weeklyTimer.textContent =
        weeklyMs > 0
          ? `Resets in ${Math.floor(weeklyMs / 86400000)}d ${formatTime(weeklyMs % 86400000)}`
          : 'Resetting...';
  }

  // Start interval
  setInterval(updateResetTimers, 1000);
  // Initial call
  updateResetTimers();
}