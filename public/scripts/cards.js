import { timerIcon, diamondIcon } from './icons.js';

// Use camelCase keys as in your mapping
const rewardColumns = [
  { key: 'archonShard', label: 'Archon Shard' },
  { key: 'installers', label: 'Installer' },
  { key: 'rareArcanes', label: 'Rare Arcane' },
  { key: 'rivens', label: 'Riven' },
  { key: 'kuva', label: 'Kuva' },
  { key: 'arcanes', label: 'Arcane' },
  { key: 'mods', label: 'Mod' },
  { key: 'other', label: '' }
];

// Build summary reward text
export function buildSummaryReward(task) {
  // Plat per hour logic (use camelCase keys!)
  if (task.pHr && (task.itemToSell || task.reward)) {
    const item = task.itemToSell || task.reward || '';
    const plat = task.plat ? `${task.plat}p` : '';
    return `
      <span class="icon-diamond">${diamondIcon}</span>
      <span class="summary-reward-value">${item}${plat ? ` (${plat})` : ''}${task.pHr ? ` (${task.pHr}p/hr)` : ''}</span>
    `;
  }

  // Otherwise, build reward list
  const rewardList = rewardColumns.flatMap(({ key, label }) => {
    const val = task[key];
    if (!val) return [];
    if (!isNaN(val) && val !== "") {
      // Handle numbers
      return (Number(val) === 1)
        ? label
        : `${val} ${label}${Number(val) > 1 ? 's' : ''}`;
    }
    // Handle text / CSV
    if (typeof val === 'string') {
      // split comma lists, trim
      return val.split(',').map(x => x.trim()).filter(Boolean).map(x => label ? `${x} ${label}` : x);
    }
    return [];
  });

  return rewardList.length
    ? `<span class="icon-diamond">${diamondIcon}</span>
       <span class="summary-reward-value">${rewardList.join(', ')}</span>`
    : '';
}

export function createCard(task) {
  if (!task || typeof task.task !== 'string') {
    console.warn('Invalid task object:', task);
    return '';
  }
  const taskId = task.task.replace(/\W+/g, '_');
  return `
    <div class="card collapsible" id="${taskId}">
      <div class="card-header">
        <span class="custom-checkbox">
          <input type="checkbox" class="check-off" data-task-id="${taskId}" id="check-${taskId}" />
          <span class="checkbox-icon"></span>
        </span>
        <label for="check-${taskId}">
          <h3>${task.task}</h3>
        </label>
      </div>
      <div class="card-details">
        <button class="minimize-btn" aria-label="Expand details">+</button>
        <div class="card-summary">
          <span class="icon-timer">${timerIcon}</span>
          <span class="summary-est-value">${task.estTotTime || task.estTime || ""}</span>
          ${buildSummaryReward(task)}
        </div>
        <div class="card-content hidden">
          ${task.taskInfo ? `<p>${task.taskInfo}</p>` : ""}
          ${task.reward ? `<p><strong>Reward:</strong> ${task.reward}</p>` : ""}
          ${(task.estTotTime || task.estTime) ? `<p><strong>Est. Time:</strong> ${task.estTotTime || task.estTime}</p>` : ""}
          ${task.missions && task.missions.length
            ? task.missions.map(createMissionCard).join('')
            : ""
          }
        </div>
      </div>
    </div>
  `;
}

// Mission Card Renderer
export function createMissionCard(mission) {
  return `
    <div class="mission-card">
      <h4>${mission.missionTitle}</h4>
      <p><strong>Tier:</strong> ${mission.tier}</p>
      <p><strong>Planet:</strong> ${mission.planet}</p>
      <p><strong>Difficulty:</strong> ${mission.difficulty}</p>
      <p><strong>Time Left:</strong> ${mission.timeLeft}</p>
    </div>
  `;
}

// Time-Sensitive Card Renderer (checked off if no missions)
export function createTimeSensitiveCard(task) {
  const taskId = task.task.replace(/\W+/g, '_');
  const isChecked = !(task.missions && task.missions.length);
  return `
    <div class="card collapsible${isChecked ? ' checked-off' : ''}" id="${taskId}">
      <div class="card-header">
        <span class="custom-checkbox">
          <input type="checkbox" class="check-off" data-task-id="${taskId}" id="check-${taskId}" ${isChecked ? "checked" : ""} />
          <span class="checkbox-icon"></span>
        </span>
        <label for="check-${taskId}">
          <h3>${task.task}</h3>
        </label>
      </div>
      <div class="card-details">
        <button class="minimize-btn" aria-label="Expand details">+</button>
        <div class="card-summary">
          <span class="icon-timer">${timerIcon}</span>
          <span class="summary-est-value">${task.estTotTime || task.estTime || ""}</span>
          ${buildSummaryReward(task)}
        </div>
        <div class="card-content hidden">
          ${task.taskInfo ? `<p>${task.taskInfo}</p>` : ""}
          ${task.reward ? `<p><strong>Reward:</strong> ${task.reward}</p>` : ""}
          ${(task.estTotTime || task.estTime) ? `<p><strong>Est. Time:</strong> ${task.estTotTime || task.estTime}</p>` : ""}
          ${task.missions && task.missions.length
            ? task.missions.map(createMissionCard).join('')
            : ""
          }
        </div>
      </div>
    </div>
  `;
}

export function renderCards(cards, containerId, cardRenderer = createCard) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = cards.map(cardRenderer).join('');
}