import { cardData } from './cardData.js';

export async function buildCardData() {
  // Deep clone cardData so you don't mutate the imported object directly (optional but safer)
  const cardDataCopy = JSON.parse(JSON.stringify(cardData));

  const response = await fetch('https://api.warframestat.us/pc');
  const data = await response.json();

  // Helper: find timeSensitive task object by name
  function findTask(name) {
    return cardDataCopy.timeSensitive.find(card => card.task === name);
  }

  // Categorize and inject missions
  // --- Speedy Relics ---
  const speedyRelics = [];
  data.fissures.forEach(fissure => {
    const { missionType, tier, node, isHard, eta } = fissure;
    const difficulty = isHard ? 'Steel Path' : 'Regular';
    const [location, planet] = node.split(' (');
    if (
      missionType === 'Capture' ||
      (missionType === 'Exterminate' && !isHard && (tier === 'Lith' || tier === 'Meso'))
    ) {
      speedyRelics.push({
        missionTitle: `${missionType} on ${location.trim()}`,
        tier,
        planet: planet?.replace(')', '').trim() || '',
        difficulty,
        timeLeft: eta
      });
    }
  });
  findTask("Speedy Relics").missions = speedyRelics;

  // --- Corrupted Holo-Key Farming ---
  const holokeyMissions = [];
  data.fissures.filter(f => f.isStorm).forEach(fissure => {
    const { missionType, node, tier, eta, isHard } = fissure;
    if (
      (missionType === 'Skirmish' || missionType === 'Extermination') &&
      (node.includes('Pluto') || node.includes('Veil'))
    ) {
      const [location, planet] = node.split(' (');
      holokeyMissions.push({
        missionTitle: `${missionType} on ${location.trim()}`,
        tier,
        planet: planet?.replace(')', '').trim() || '',
        difficulty: isHard ? 'Steel Path' : 'Regular',
        timeLeft: eta
      });
    }
  });
  findTask("Corrupted Holo-Key Farming").missions = holokeyMissions;

  // --- Lich Key & Kuva & Leveling Affinity ---
  const lichKuva = [];
  data.fissures.forEach(fissure => {
    const { missionType, node, tier, isHard, eta } = fissure;
    if (node.includes('Kuva Fortress') && missionType === 'Survival') {
      const [location, planet] = node.split(' (');
      lichKuva.push({
        missionTitle: `${missionType} on ${location.trim()}`,
        tier,
        planet: planet?.replace(')', '').trim() || '',
        difficulty: isHard ? 'Steel Path' : 'Regular',
        timeLeft: eta
      });
    }
  });
  findTask("Lich Key & Kuva & Leveling Affinity").missions = lichKuva;

  // --- Lich Key + Rare Mod Spy ---
  const lichSpy = [];
  data.fissures.forEach(fissure => {
    const { missionType, node, tier, isHard, eta } = fissure;
    if (node.includes('Kuva Fortress') && missionType === 'Spy') {
      const [location, planet] = node.split(' (');
      lichSpy.push({
        missionTitle: `${missionType} on ${location.trim()}`,
        tier,
        planet: planet?.replace(')', '').trim() || '',
        difficulty: isHard ? 'Steel Path' : 'Regular',
        timeLeft: eta
      });
    }
  });
  findTask("Lich Key + Rare Mod Spy").missions = lichSpy;

  // --- Argon Crystals ---
  const argonCrystals = [];
  data.fissures.forEach(fissure => {
    const { missionType, tier, node, isHard, eta } = fissure;
    if (node.includes('Void')) {
      const [location, planet] = node.split(' (');
      argonCrystals.push({
        missionTitle: `${missionType} on ${location.trim()}`,
        tier,
        planet: planet?.replace(')', '').trim() || '',
        difficulty: isHard ? 'Steel Path' : 'Regular',
        timeLeft: eta
      });
    }
  });
  findTask("Argon Crystals").missions = argonCrystals;

  // --- Return new cardData object with dynamic missions ---
  return cardDataCopy;
}