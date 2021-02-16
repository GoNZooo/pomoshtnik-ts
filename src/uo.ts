import * as svt from "simple-validation-tools";

const words = {
  An: "Negate or Dispel",
  Nox: "Poison",
  Bet: "Small",
  Ort: "Magic",
  Corp: "Death",
  Por: "Move or Movement",
  Des: "Lower or Down",
  Quas: "Illusion",
  Ex: "Freedom",
  Rel: "Change",
  Flam: "Flame",
  Sanct: "Protect or Protection",
  Grav: "Field",
  Tym: "Time",
  Hur: "Wind",
  Uus: "Raise or Up",
  In: "Make, Create or Cause",
  Vas: "Great",
  Jux: "Danger, Trap or Harm",
  Wis: "Know or Knowledge",
  Kal: "Summon or Invoke",
  Xen: "Creature",
  Lor: "Light",
  Ylem: "Matter",
  Mani: "Life or Healing",
  Zu: "Sleep",
} as Record<string, string>;

const spells = {
  Clumsy: "Uus Jux",
  "Create Food": "In Mani Ylem",
  Feeblemind: "Rel Wis",
  Heal: "In Mani",
  "Magic Arrow": "In Por Ylem",
  "Night Sight": "In Lor",
  "Reactive Armor": "Flam Sanct",
  Weaken: "Des Mani",
  Agility: "Ex Uus",
  Cunning: "Uus Wis",
  Cure: "An Nox",
  Harm: "An Mani",
  "Magic Trap": "In Jux",
  "Magic Untrap": "An Jux",
  Protection: "Uus Sanct",
  Strength: "Uus Mani",
  Bless: "Rel Sanct",
  Fireball: "Vas Flam",
  "Magic Lock": "An Por",
  Poison: "In Nox",
  Telekinesis: "Ort Port Ylem",
  Teleport: "Rel Por",
  Unlock: "Ex Por",
  "Wall of Stone": "In Sanct Ylem",
  "Arch Cure": "Vas An Nox",
  "Arch Protection": "Vas Uus Sanct",
  Curse: "Des Sanct",
  "Fire Field": "In Flam Grav",
  "Greater Heal": "In Vas Mani",
  Lightning: "Por Ort Grav",
  "Mana Drain": "Ort Rel",
  Recall: "Kal Ort Por",
  "Blade Spirits": "In Jux Hur Ylem",
  "Dispel Field": "An Grav",
  Incognito: "Kal In Ex",
  "Magic Reflection": "In Jux Sanct",
  "Mind Blast": "Por Corp Wis",
  Paralyze: "An Ex Por",
  "Poison Field": "In Nox Grav",
  "Summon Creature": "Kal Xen",
  Dispel: "An Ort",
  "Energy Bolt": "Corp Por",
  Explosion: "Vas Ort Flam",
  Invisibility: "An Lor Xen",
  Mark: "Kal Por Ylem",
  "Mass Curse": "Vas Des Sanct",
  "Paralyze Field": "In Ex Grav",
  Reveal: "Wis Quas",
  "Chain Lightning": "Vas Ort Grav",
  "Energy Field": "In Sanct Grav",
  Flamestrike: "Kal Vas Flam",
  "Gate Travel": "Vas Rel Por",
  "Mana Vampire": "Ort Sanct",
  "Mass Dispel": "Vas An Ort",
  "Meteor Swarm": "Flam Kal Des Ylem",
  Polymorph: "Vas Ylem Rel",
  Earthquake: "In Vas Por",
  "Energy Vortex": "Vas Corp Por",
  Resurrection: "An Corp",
  "Summon Air Elemental": "Kal Vas Xen Hur",
  "Summon Daemon": "Kal Vas Xen Corp",
  "Summon Earth Elemental": "Kal Vas Xen Ylem",
  "Summon Fire Elemental": "Kal Vas Xen Flam",
  "summon Water Elemental": "Kal Vas Xen An Flam",
} as const;

export type Spell = keyof typeof spells;

export type SpellDescription = {
  spell: Spell;
  powerWords: string[];
  translatedWords: string[];
};

export function getSpellDescription(spell: Spell): SpellDescription {
  const powerWords = spells[spell].split(" ");
  const translatedWords = powerWords.map((w) => words[w]);

  return {spell, powerWords, translatedWords};
}

export function validateSpell(value: unknown): svt.ValidationResult<Spell> {
  return typeof value === "string" && value in spells
    ? {type: "Valid", value: value as Spell}
    : {
        type: "Invalid",
        errors: `${value} is not a valid spell, expected one of: ${Object.keys(spells).join(", ")}`,
      };
}
