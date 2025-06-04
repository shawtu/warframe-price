// Lowercase keys, values can be:
// - a string: the market slug to use for warframe.market API lookup
// - null: not tradeable on warframe.market
// - { slug, price }: a hardset price (optionally with a market slug if you want to display both)
// - { price }: a hardset price only, not on warframe.market

export const marketNameOverrides = {
  // Umbra & Sacrificial mods are not tradeable on the market
  "umbral intensify": null,
  "umbral fiber": null,
  "umbral vitality": null,
  "sacrificial steel": null,
  "sacrificial pressure": null,

  // Example: blueprint with hardset price
  "exilus warframe adapter blueprint": { price: "Buy completed from store instead" },
  "melee arcane adapter": { price: 20 },

  // Items with a market slug override (e.g. because the in-game name doesn't match the market slug)
  "companion weapon riven mod": { slug: "companion_weapon_riven_mod_(veiled)" },
  "restorative bond (companion)": { slug: "restorative_bond" },
  "manifold bond (robotic)": { slug: "manifold_bond" },
  "covert bond (companion)": { slug: "covert_bond" },
  "mystic bond (companion)": { slug: "mystic_bond" },
  "tandem bond (beast)": { slug: "tandem_bond" },

  // Example: hardset price for rare mod
  "primed chamber": { price: 12000 },

  // Not tradeable on market
  "some untradeable thing": null,

  // Example: just a slug override for market lookup
  "amber ayatan star": "amber_ayatan_star",

  // Aura mod hardset prices (overrides)
  "sprint boost": { price: 24 },
  "enemy radar": { price: 20 },
  "loot detector": { price: 19 },
  "corrosive projection": { price: 19 },
  "holster amp": { price: 18 },
  "steel charge": { price: 18 },
  "rifle scavenger": { price: 17 },
  "pistol scavenger": { price: 16 },
  "rejuvenation": { price: 15 },
  "rifle amp": { price: 15 },
  "shield disruption": { price: 15 },
  "dead eye": { price: 15 },
  "energy siphon": { price: 14 },
  "emp aura": { price: 12 },
  "infested impedance": { price: 12 },
  "sniper scavenger": { price: 10 },
  "dreamer's bond": { price: 10 },
  "shotgun scavenger": { price: 9 },
  "physique": { price: 9 },
  // Add more overrides as needed!
};