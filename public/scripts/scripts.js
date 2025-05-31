import { buildCardData } from './cardDataBuilder.js';
import { renderCards, createTimeSensitiveCard } from './cards.js';
import { setupUIFunctionality } from './UIfunctionality.js';
import { startResetTimers } from './resetTimers.js';
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
});