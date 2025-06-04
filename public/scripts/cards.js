import {
  timerIcon,
  diamondIcon,
  platHrIcon,
  locIcon,
  warframeIcon,
  farmIcon,
  archonIcon,
  installersIcon,
  kuvaIcon,
  rivenIcon,
  rareArcanesIcon,
  arcanesIcon,
  otherIcon
} from './icons.js';

// Map reward columns to their display labels and pluralization rules
const rewardColumnMap = [
  { key: 'archonShard', label: 'archon shard', plural: 'archon shards' },
  { key: 'installers', label: 'installer', plural: 'installers' },
  { key: 'kuva', label: 'kuva', plural: 'kuva' },
  { key: 'riven', label: 'riven', plural: 'rivens' },
  { key: 'rareArcanes', label: 'rare arcane', plural: 'rare arcanes' },
  { key: 'arcanes', label: 'arcane', plural: 'arcanes' },
  { key: 'other', label: '', plural: '' }
];

// Consistent reward value formatter
function formatRewardValue(key, value) {
  const map = rewardColumnMap.find(e => e.key === key);
  const label = map?.label ?? '';
  const plural = map?.plural ?? (label + 's');

  if (!value) return '';
  if (!isNaN(value) && value !== "") {
    const n = Number(value);
    if (n === 1) return label;
    return `${n} ${plural}`;
  }
  if (typeof value === 'string') {
    // If the string contains only numbers, still use number logic
    if (!isNaN(value.trim())) {
      const n = Number(value.trim());
      if (n === 1) return label;
      return `${n} ${plural}`;
    }
    // Otherwise, just return the text verbatim, split by commas
    return value.split(',')
      .map(x => x.trim())
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

function buildRewardList(task) {
  return rewardColumnMap.flatMap(({ key }) => {
    const val = task[key];
    const formatted = formatRewardValue(key, val);
    return formatted ? [formatted] : [];
  }).join(', ');
}

export function buildSummaryReward(task) {
  let summary = '';
  let icon = null;
  let iconClass = '';

  if (task.pHr) {
    icon = platHrIcon;
    iconClass = 'icon--plat';
    if (task.itemToSell) {
      summary = `${task.pHr}p/hr ${task.itemToSell}${task.plat ? ` (${task.plat}p)` : ''}`;
    } else {
      const rewardList = buildRewardList(task);
      summary = `${task.pHr}p/hr ${rewardList}${task.plat ? ` (${task.plat}p)` : ''}`;
    }
  } else {
    icon = diamondIcon;
    iconClass = 'icon--diamond';
    const rewardList = buildRewardList(task);
    summary = rewardList;
  }

  summary = summary.trim();
  return summary
    ? `<span class="icon ${iconClass}">${icon}</span>
       <span class="summary-reward-value">${summary}</span>`
    : '';
}

// Build vertical rewards with icon to the left of the value, using consistent formatting
function buildVerticalReward(task) {
  if (task.pHr) {
    let summary = '';
    if (task.itemToSell) {
      summary = `${task.pHr}p/hr ${task.itemToSell}${task.plat ? ` (${task.plat}p)` : ''}`;
    } else {
      const rewardList = buildRewardList(task);
      summary = `${task.pHr}p/hr ${rewardList}${task.plat ? ` (${task.plat}p)` : ''}`;
    }
    return `
      <div class="info-row">
        <span class="icon icon--plat">${platHrIcon}</span>
        <span class="reward-value">${summary}</span>
      </div>
    `;
  }
  // Otherwise, show vertical list of rewards (only if present), using consistent formatting
  const rows = [
    { icon: archonIcon, key: 'archonShard' },
    { icon: installersIcon, key: 'installers' },
    { icon: kuvaIcon, key: 'kuva' },
    { icon: rivenIcon, key: 'riven' },
    { icon: rareArcanesIcon, key: 'rareArcanes' },
    { icon: arcanesIcon, key: 'arcanes' },
    { icon: otherIcon, key: 'other' }
  ].map(row => ({
    ...row,
    value: formatRewardValue(row.key, task[row.key])
  })).filter(row => row.value);

  return rows.length
    ? rows.map(row => `
        <div class="info-row">
          <span class="icon">${row.icon}</span>
          <span class="summary-reward-value">${row.value}</span>
        </div>
      `).join('')
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
          <span class="icon icon--timer">${timerIcon}</span>
          <span class="summary-est-value">${task.estTotTime || task.estTime || ""}</span>
          ${buildSummaryReward(task)}
        </div>
        <div class="card-content hidden">
          ${(task.estTotTime || task.estTime) ? `
            <div class="info-row">
              <span class="icon icon--timer">${timerIcon}</span>
              <span class="reward-value">${task.estTotTime || task.estTime}</span>
            </div>` : ""}
          ${task.location ? `
            <div class="info-row">
              <span class="icon icon--location">${locIcon}</span>
              <span class="reward-value">${task.location}</span>
            </div>` : ""}
          ${task.taskInfo ? `
            <div class="info-row">
              <span class="reward-value">${task.taskInfo}</span>
            </div>` : ""}
          ${task.warframe ? `
            <div class="info-row">
              <span class="icon icon--warframe">${warframeIcon}</span>
              <span class="reward-value">${task.warframe}</span>
            </div>` : ""}
          ${task.concurrentFarm ? `
            <div class="info-row">
              <span class="icon icon--farm">${farmIcon}</span>
              <span class="reward-value">${task.concurrentFarm}</span>
            </div>` : ""}
          ${buildVerticalReward(task)}
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
          <span class="icon icon--timer">${timerIcon}</span>
          <span class="summary-est-value">${task.estTotTime || task.estTime || ""}</span>
          ${buildSummaryReward(task)}
        </div>
        <div class="card-content hidden">
          ${(task.estTotTime || task.estTime) ? `
            <div class="info-row">
              <span class="icon icon--timer">${timerIcon}</span>
              <span class="reward-value">${task.estTotTime || task.estTime}</span>
            </div>` : ""}
          ${task.location ? `
            <div class="info-row">
              <span class="icon icon--location">${locIcon}</span>
              <span class="reward-value">${task.location}</span>
            </div>` : ""}
          ${task.taskInfo ? `
            <div class="info-row">
              <span class="reward-value">${task.taskInfo}</span>
            </div>` : ""}
          ${task.warframe ? `
            <div class="info-row">
              <span class="icon icon--warframe">${warframeIcon}</span>
              <span class="reward-value">${task.warframe}</span>
            </div>` : ""}
          ${task.concurrentFarm ? `
            <div class="info-row">
              <span class="icon icon--farm">${farmIcon}</span>
              <span class="reward-value">${task.concurrentFarm}</span>
            </div>` : ""}
          ${buildVerticalReward(task)}
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