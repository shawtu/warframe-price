import { buildCardData } from './cardDataBuilder.js';
import { renderCards, createTimeSensitiveCard } from './cards.js';
import { setupUIFunctionality } from './UIfunctionality.js';
import { startResetTimers, startMissionCountdowns } from './resetTimers.js'; // <--- NEW: import timers
import { setupCheckboxIcons } from './checkboxIcons.js';

document.addEventListener('DOMContentLoaded', async () => {
  const cardData = await buildCardData();
  renderCards(cardData.specialImportance, "special-importance-cards");
  renderCards(cardData.weeklyTasks, "weekly-tasks-cards");
  renderCards(cardData.dailyTasks, "daily-tasks-cards");
  renderCards(cardData.timeSensitive, "time-sensitive-cards", createTimeSensitiveCard);
  setupUIFunctionality();
  setupCheckboxIcons();
  startResetTimers();

  // --- NEW: Gather all missions and start their timers ---
  // Flatten all missions from all cardData arrays (skip if not present)
  const allMissions = [
    ...cardData.specialImportance,
    ...cardData.weeklyTasks,
    ...cardData.dailyTasks,
    ...cardData.timeSensitive,
  ]
    .filter(task => Array.isArray(task.missions))
    .flatMap(task => task.missions);

  // Start live countdowns for all mission timers
  startMissionCountdowns(allMissions);
});