import * as svt from "simple-validation-tools";
import {Spell} from "../pomoshtnik-shared/gotyno/uo";

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

export const spells: Record<Spell, string> = {
  clumsy: "Uus Jux",
  "create food": "In Mani Ylem",
  feeblemind: "Rel Wis",
  heal: "In Mani",
  "magic arrow": "In Por Ylem",
  "night sight": "In Lor",
  "reactive armor": "Flam Sanct",
  weaken: "Des Mani",
  agility: "Ex Uus",
  cunning: "Uus Wis",
  cure: "An Nox",
  harm: "An Mani",
  "magic trap": "In Jux",
  "magic untrap": "An Jux",
  protection: "Uus Sanct",
  strength: "Uus Mani",
  bless: "Rel Sanct",
  fireball: "Vas Flam",
  "magic lock": "An Por",
  poison: "In Nox",
  telekinesis: "Ort Port Ylem",
  teleport: "Rel Por",
  unlock: "Ex Por",
  "wall of stone": "In Sanct Ylem",
  "arch cure": "Vas An Nox",
  "arch protection": "Vas Uus Sanct",
  curse: "Des Sanct",
  "fire field": "In Flam Grav",
  "greater heal": "In Vas Mani",
  lightning: "Por Ort Grav",
  "mana drain": "Ort Rel",
  recall: "Kal Ort Por",
  "blade spirits": "In Jux Hur Ylem",
  "dispel field": "An Grav",
  incognito: "Kal In Ex",
  "magic reflection": "In Jux Sanct",
  "mind blast": "Por Corp Wis",
  paralyze: "An Ex Por",
  "poison field": "In Nox Grav",
  "summon creature": "Kal Xen",
  dispel: "An Ort",
  "energy bolt": "Corp Por",
  explosion: "Vas Ort Flam",
  invisibility: "An Lor Xen",
  mark: "Kal Por Ylem",
  "mass curse": "Vas Des Sanct",
  "paralyze field": "In Ex Grav",
  reveal: "Wis Quas",
  "chain lightning": "Vas Ort Grav",
  "energy field": "In Sanct Grav",
  flamestrike: "Kal Vas Flam",
  "gate travel": "Vas Rel Por",
  "mana vampire": "Ort Sanct",
  "mass dispel": "Vas An Ort",
  "meteor swarm": "Flam Kal Des Ylem",
  polymorph: "Vas Ylem Rel",
  earthquake: "In Vas Por",
  "energy vortex": "Vas Corp Por",
  resurrection: "An Corp",
  "summon air elemental": "Kal Vas Xen Hur",
  "summon daemon": "Kal Vas Xen Corp",
  "summon earth elemental": "Kal Vas Xen Ylem",
  "summon fire elemental": "Kal Vas Xen Flam",
  "summon water elemental": "Kal Vas Xen An Flam",
};

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
