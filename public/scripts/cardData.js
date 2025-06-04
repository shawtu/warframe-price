import { loadTSV } from './loadTSV.js';

/**
 * Loads cardData, merging TSV weekly/daily tasks with your hardcoded sections.
 * Usage: getCardData().then(cardData => { ... });
 */
export async function getCardData() {
  const allTasks = await loadTSV('/data/taskSheet2.tsv');

  // Map TSV header names to camelCase JS property names
function mapRow(row) {
  return {
    type: row['Type'],
    task: row['Task'],
    location: row['Location'],
    taskInfo: row['Task Info'],
    warframe: row['Warframe'],
    concurrentFarm: row['Concurrent Farm'],
    xPerMission: row['X per Mission'],
    timeToComplete: row['Time to Complete'],
    repPerMin: row['Rep per Min'],
    estTotTime: row['Est Tot Time'],
    reward: row['Reward'],
    plat: row['Plat'],
    pHr: row['P/hr'],
    itemToSell: row['Item to Sell'],
    repPrice: row['Rep Price'],
    archonShard: row['Archon Shard'],
    installers: row['Installers'],
    kuva: row['Kuva'],
    riven: row['Riven'],
    rareArcanes: row['Rare Arcanes'],
    arcanes: row['Arcanes'],
    other: row['Other']
  };
}

  const weeklyTasks = allTasks
    .filter(row => row.Type === 'weekly')
    .map(mapRow);
  const dailyTasks = allTasks
    .filter(row => row.Type === 'daily')
    .map(mapRow);

  return {
    specialImportance: [
      /*{
        task: "Limited-Time Alerts",
        taskInfo: "Track and complete limited-time events or alerts before they expire.",
      },
      {
        task: "Baro Trader",
        taskInfo: "Check Baro Ki'Teer's inventory (rotates every 2 weeks).",
      },
      {
        task: "Tenet Melee Items",
        taskInfo: "Track Tenet melee item rotations (every 4 days).",
      },
      {
        task: "SP Vendor - Umbra Forma",
        taskInfo: "Check weekly Umbra Forma offers from the SP Vendor.",
      },*/
    ],
    weeklyTasks,
    dailyTasks,
    timeSensitive: [
      {
        task: "Speedy Relics",
        taskInfo: "mission: Void Fissure, tier: Lith/Meso, type: Capture/Exterminate, location: -, isHard: Regular",
        reward: "Prime Parts, void traces",
        estTime: "2-3m"
      },
      {
        task: "Corrupted Holo-Key Farming",
        taskInfo: "mission: Railjack Void Storms, tier: -, type: Skirmish/Exterminate, location: Veil/Pluto, isHard: Regular",
        reward: "30% chance 10x Corrupted Holo-Key, Prime Parts, void traces",
        estTime: "20m"
      },
      {
        task: "Holdfast Rep (NO API)",
        taskInfo: "Bonus Objective: Kill Void Angel, tier: -, type: Exterminate, location: Zariman Ten Zero",
        estTime: "4m"
      },
      {
        task: "Lich Key & Kuva & Leveling Affinity",
        taskInfo: "mission: Void Fissure, tier: Requiem, type: Survival, location: Kuva Fortress, isHard: Regular"
      },
      {
        task: "Lich Key + Rare Mod Spy",
        taskInfo: "mission: Void Fissure, tier: Requiem, type: Spy, location: Kuva Fortress, isHard: Regular",
        estTime: "Wukong 3-5m"
      },
      {
        task: "Argon Crystals",
        reward: "Argon crystals, void traces",
        missions: [
          {
            missionTitle: "Mobile Defense on Tiwaz",
            tier: "Axi",
            planet: "Void",
            difficulty: "Regular",
            timeLeft: "35m 12s"
          },
          {
            missionTitle: "Capture on Ukko",
            tier: "Lith",
            planet: "Void",
            difficulty: "Steel Path",
            timeLeft: "12m 41s"
          }
        ]
      },
      {
        task: "Eidolon Hunt",
        taskInfo: "mission: Eidolon Hunt, tier: -, type: -, location: Earth (Night Cycle), isHard: Regular",
        reward: "eidolon shards, arcanes for plat",
        estTime: "30m"
      },
      {
        task: "Void Cascade Plat Farm",
        taskInfo: "mission: Void Fissure, tier: -, type: Void Cascade, location: -, isHard: Regular",
        reward: "arcanes for plat"
      }
    ]
  };
}