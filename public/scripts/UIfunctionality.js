// --- Button click actions ---
function minimizeClicked(btn) {
  const parent = btn.closest('.collapsible');
  const content = parent.querySelector('.section-content, .card-content');
  if (content) {
    const willBeHidden = !content.classList.contains('hidden');
    minimizeAction(parent, willBeHidden);

    // Save open/closed state (open = !willBeHidden)
    const card = btn.closest('.card');
    if (card) {
      const checkbox = card.querySelector('.check-off');
      const taskId = checkbox && checkbox.getAttribute('data-task-id');
      if (taskId) {
        saveCardState(taskId, { open: !willBeHidden });
      }
    }
  }
}

function checkboxClicked(checkbox) {
  const card = checkbox.closest('.card');
  const taskId = checkbox.getAttribute('data-task-id');
  if (!card || !taskId) return;

  card.classList.toggle('checked-off', checkbox.checked);
  minimizeAction(card, checkbox.checked);

  // Save checked/done state
  saveCardState(taskId, { checked: checkbox.checked });

  reorderCardsInSection(card.parentElement);
}

// --- Visual helpers ---
function findCardRoot(element) {
  while (element && (!element.classList || !element.classList.contains('card') || !element.id)) {
    element = element.parentElement;
  }
  return element;
}

function minimizeAction(childElement, shouldMinimize) {
  const card = findCardRoot(childElement);
  if (!card) return;

  const cardSummary = card.querySelector('.card-summary');
  const cardContent = card.querySelector('.card-content');
  const minimizeBtn = card.querySelector('.minimize-btn');

  if (shouldMinimize) {
    if (cardSummary) cardSummary.classList.remove('hidden');
    if (cardContent) cardContent.classList.add('hidden');
    if (minimizeBtn) minimizeBtn.textContent = '+';
  } else {
    if (cardSummary) cardSummary.classList.add('hidden');
    if (cardContent) cardContent.classList.remove('hidden');
    if (minimizeBtn) minimizeBtn.textContent = '-';
  }
}

// --- Data helpers ---
function saveCardState(taskId, { checked = undefined, open = undefined } = {}) {
  const state = JSON.parse(localStorage.getItem('cardStates') || '{}');
  if (!state[taskId]) state[taskId] = {};
  if (checked !== undefined) state[taskId].checked = checked;
  if (open !== undefined) state[taskId].open = open;
  localStorage.setItem('cardStates', JSON.stringify(state));
}

// -- Restore Checkboxes and open state to where they were on last visit ---
function restoreAllCardStates() {
  const state = JSON.parse(localStorage.getItem('cardStates') || '{}');
  // Only restore for checkboxes NOT inside #time-sensitive-cards
  document.querySelectorAll('.check-off:not(#time-sensitive-cards .check-off)').forEach(checkbox => {
    const card = checkbox.closest('.card');
    const taskId = checkbox.getAttribute('data-task-id');
    if (!card || !taskId) return;
    const cardState = state[taskId] || {};
    // Checked state
    checkbox.checked = !!cardState.checked;
    card.classList.toggle('checked-off', !!cardState.checked);
    // Open/close state
    const isOpen = cardState.open !== undefined ? cardState.open : false;
    minimizeAction(card, !isOpen);
  });
}

// --- Card ordering ---
function reorderCardsInSection(cardsContainer) {
  const allCards = Array.from(cardsContainer.querySelectorAll('.card'));
  const notDone = allCards.filter(c => !c.classList.contains('checked-off'));
  const done = allCards.filter(c => c.classList.contains('checked-off'));
  allCards.forEach(c => cardsContainer.removeChild(c));
  [...notDone, ...done].forEach(c => cardsContainer.appendChild(c));
}

// --- Main setup ---
export function setupUIFunctionality() {
  // Add Button Listeners
  document.querySelectorAll('.minimize-btn').forEach(btn => {
    btn.addEventListener('click', () => minimizeClicked(btn));
  });

  // Add Checkbox Listeners
  document.querySelectorAll('.check-off').forEach(checkbox => {
    checkbox.addEventListener('change', () => checkboxClicked(checkbox));
  });

  // Restore state
  restoreAllCardStates();
  reorderCardsInSection(document.getElementById("time-sensitive-cards"));
  reorderCardsInSection(document.getElementById("weekly-tasks-cards"));
  reorderCardsInSection(document.getElementById("daily-tasks-cards"));
}

// Utility to reset checked-off and open state for all cards in a section
function clearCheckedOffTasksForSection(sectionCardsContainerId) {
  const cardsSection = document.getElementById(sectionCardsContainerId);
  if (!cardsSection) return;

  const checkboxes = cardsSection.querySelectorAll('.check-off');
  const cardStates = JSON.parse(localStorage.getItem('cardStates') || '{}');
  let changed = false;

  checkboxes.forEach(checkbox => {
    const taskId = checkbox.getAttribute('data-task-id');
    if (!taskId) return;

    // Reset checked and open state
    if (!cardStates[taskId]) cardStates[taskId] = {};
    if (cardStates[taskId].checked !== false || cardStates[taskId].open !== false) {
      cardStates[taskId].checked = false;
      cardStates[taskId].open = false;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem('cardStates', JSON.stringify(cardStates));
  }

  // Update UI
  restoreAllCardStates();
  reorderCardsInSection(cardsSection);
}

// Add event listeners to the buttons
document.getElementById("clear-daily").addEventListener("click", function() {
  clearCheckedOffTasksForSection("daily-tasks-cards");
});
document.getElementById("clear-weekly").addEventListener("click", function() {
  clearCheckedOffTasksForSection("weekly-tasks-cards");
});