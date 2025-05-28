// Card Data and Rendering
export const cardData = {
  specialImportance: [
    {
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
    },
  ],
  weeklyTasks: [
    {
      task: "Ironwake Buys",
      taskInfo: "Buy weekly items at Ironwake.",
      estTime: "2m",
      reward: "2 rivens, kuva"
    },
    {
      task: "Cavia Rep",
      taskInfo: "Talk to Bird (choose Shiny option).",
      estTime: "2m",
      reward: "Archon Shard"
    },
    {
      task: "1999 Calendar",
      taskInfo: "Combine with daily rep, Coda (not defense) or Temple release farm (defense).",
      reward: "Check for mix of Archon Shards, Arcanes, and Forma."
    },
    {
      task: "Kahl Mission",
      taskInfo: "Complete Kahl's weekly mission.",
      estTime: "15-30m",
      reward: "100-120 rep; 40 rep = Archon Intensity/Continuity (20p value)"
    },
    {
      task: "Archon Hunt",
      taskInfo: "Complete the weekly Archon Hunt.",
      estTime: "30m",
      reward: "Archon Shard"
    },
    {
      task: "Use 5 Explores Weekly",
      taskInfo: "Do Netracell (1), Elite Deep Archimadea (2).",
      estTime: "60+m",
      reward: "Tau Archon shards, rare arcanes, Omni-Forma"
    },
    {
      task: "Duviri Circuit",
      taskInfo: "Check for new Incarnons. (May change in a month)",
      estTime: "120+m",
      reward: "Incarn, arcanes"
    },
    {
      task: "Duviri Pathos Clamp Buys",
      taskInfo: "Dormizone, Zariman - check vendor.",
      estTime: "2m",
      reward: "20 Clamps = Exilus Weapon Adaptor"
    }
  ],
  dailyTasks: [
    {
      task: "Simaris Rep",
      taskInfo: "Use Ivara to stealth scan for rep at Temple of Profit, Fortuna.",
      estTime: "10m",
      reward: "100,000 rep = Companion Weapon Riven (59-69 plat)"
    },
    {
      task: "1999 / Hex Rep",
      taskInfo: "Do 3-4 missions, focus on weekly and Coda Lich.",
      estTime: "20-30m",
      reward: "50k rep = element swap item, also arcanes"
    },
    {
      task: "ZarimanZero/Holdfast Rep",
      taskInfo: "Turn in Rep Items. Check for Exterminate Bounty with bonus Void Angel.",
      estTime: "2m",
      reward: "Finish getting arcanes"
    },
    {
      task: "Archimadea Rep",
      taskInfo: "Do bounties.",
      estTime: "40m",
      reward: "???"
    }
  ],
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
  ],
};