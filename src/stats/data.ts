import Decimal, { type DecimalSource } from "break_infinity.js"
import { reactive } from "vue"
import { DOMCacheGetOrSet } from "../DOMCache"
import { toKebabCase } from "../utilities"
import type { SectionData, StatData } from "./types"

const STATS_STORAGE_KEY = 'allStats'
const STATS_STORAGE_TIMESTAMP_KEY = 'allStatsTimestamp'
const SAVE_INTERVAL = 60_000

export const baseStats: Record<string, DecimalSource | boolean> = reactive({
  obtBase: 0,
  offBase: 0,
  quarks: 0,
  subscribersBonus: 0,
  personalSubscriptionBonus: 0,
  activeBells: 0,
  runeSiExp: new Decimal,
  runeSiCoef: 0,
  runeSiBonus: 0,
  runeIaExp: new Decimal,
  runeIaBonus: 0,
  runeIaTalisman: 0,
  runeAoag: false,
  talismanPower: 0,
  quarkHept1: 0,
  quarkHept2: 0,
  quarkHept3: 0,
  quarkHept4: 0,
  quarkHeptInf: 0,
  shopLuck1: 0,
  shopLuck2: 0,
  shopLuck3: 0,
  shopLuck4: 0,
  shopRedLuck1: 0,
  shopRedLuck2: 0,
  shopRedLuck3: 0,
  shopRedLuck4: 0,
  shopAmbGen1: 0,
  shopAmbGen2: 0,
  shopAmbGen3: 0,
  shopAmbGen4: 0,
  shopSingularityReducer: 0,
  ascensionSpeed: 0,
  ascensionSpread: 0,
  transcription: 0,
  cubes: 0,
  tesseracts: 0,
  hypercubes: 0,
  platonicCubes: 0,
  hepteracts: 0,
  octeracts: 0,
  cubesTotal: 0,
  chronosHepteract: 0,
  hypercubeHepteract: 0,
  quarkHepteract: 0,
  challengeHepteract: 0,
  abyssHepteract: 0,
  acceleratorHepteract: 0,
  acceleratorBoostHepteract: 0,
  multiplierHepteract: 0,
  overfluxPowder: 0,
  currentSingularity: 0,
  currentExalt: 0,
  lifetimeAmbrosia: 0,
  lifetimeRedAmbrosia: 0,
  ambrosiaBarPoints: 0,
  redBarPoints: 0,
  blueberries: 0,
  baseLuck: 0,
  redLuck: 0,
  luckConversion: 0
})

export const genericSection: SectionData = {
  title: 'Generic Stats',
  statCards: false,
  items: [
    {
      field: 'obtBase',
      title: 'Base Obtainium',
      src: 'https://synergism.cc/Pictures/Default/BlueberryBaseObtainium1.png',
      alt: 'obt',
      type: 'number',
      min: 1,
      max: 1e300,
      step: 1
    },
    {
      field: 'offBase',
      title: 'Base Offerings',
      src: 'https://synergism.cc/Pictures/Default/BlueberryBaseOffering1.png',
      alt: 'off',
      type: 'number',
      min: 1,
      max: 1e300,
      step: 1
    },
    {
      field: 'quarks',
      title: 'Quarks',
      src: 'https://synergism.cc/Pictures/Default/Quark.png',
      alt: 'quark',
      type: 'number',
      placeholder: 'Amount',
      min: 0,
      max: 1e300
    }
  ]
}

export const pseudoCoinSection: SectionData = {
  title: 'PseudoCoins',
  statCards: false,
  items: [
    {
      field: 'subscribersBonus',
      title: 'Generous Subscribers Bonus',
      src: 'https://synergism.cc/Pictures/PseudoShop/GOLDEN_QUARK_BUFF.png',
      alt: 'store icon',
      type: 'number',
      min: 0,
      max: 1e300,
      placeholder: 'Percent'
    },
    {
      field: 'personalSubscriptionBonus',
      title: 'Personal Subscription Bonus',
      type: 'number',
      min: 0,
      max: 1e300,
      placeholder: 'Percent'
    },
    {
      field: 'activeBells',
      title: 'Active Bells',
      src: 'https://synergism.cc/Pictures/PseudoShop/HAPPY_HOUR_BELL.png',
      alt: 'bell',
      type: 'number',
      min: 0,
      max: 10,
      step: 1
    }
  ]
}

const runeStat = (field: string, title: string, src?: string, alt?: string): StatData => ({
  field,
  title,
  src: src ? `https://synergism.cc/Pictures/Runes/${src}.png` : undefined,
  alt,
  type: 'number',
  min: 0,
  max: src === undefined ? 1e300 : undefined
})

export const runeSIStats: StatData[] = [
  runeStat('runeSiExp', 'Superior Intellect Rune EXP', 'SuperiorIntellect', 'rune SI'),
  runeStat('runeSiCoef', 'Rune Coefficient'),
  runeStat('runeSiBonus', 'Bonus Levels')
]

export const runeIAStats: StatData[] = [
  runeStat('runeIaExp', 'Infinite Ascent Rune EXP', 'InfiniteAscent', 'rune SI'),
  runeStat('runeIaBonus', 'Total Bonus Levels'),
  runeStat('runeIaTalisman', 'Bonus Levels from Talismans')
]

export const runeAoAGStats: StatData[] = [
  {
    field: 'runeAoag',
    title: 'Antiquities of the Ant God acquired',
    src: 'https://synergism.cc/Pictures/Runes/Antiquities.png',
    alt: 'antiquities',
    type: 'checkbox'
  }
]

export const talismanPowerStat: StatData = {
  field: 'talismanPower',
  title: 'Talisman Power',
  src: 'https://synergism.cc/Pictures/img_transparent.png',
  alt: 'talisman',
  type: 'number',
  min: 1,
  max: 1e300
}

const shopStat = (field: string, title: string, alt: string, max: number, src?: string): StatData => ({
  field,
  title,
  src: `https://synergism.cc/Pictures/${src ? `Default/${src}` : 'img_transparent'}.png`,
  alt,
  type: 'number',
  placeholder: 'Level',
  min: 0,
  max,
  step: 1
})

export const shopHepteractSection: SectionData = {
  title: 'Shop Upgrades: Quark Hepteracts',
  statCards: true,
  items: [
    shopStat('quarkHept1', 'Quark Hepteract 1', 'quark hept 1', 10, 'ShopImprovedQuarkHepteract0'),
    shopStat('quarkHept2', 'Quark Hepteract 2', 'quark hept 2', 10, 'ShopImprovedQuarkHepteract'),
    shopStat('quarkHept3', 'Quark Hepteract 3', 'quark hept 3', 10, 'ShopImprovedQuarkHepteract2'),
    shopStat('quarkHept4', 'Quark Hepteract 4', 'quark hept 4', 10, 'ShopImprovedQuarkHepteract3'),
    shopStat(
      'quarkHeptInf',
      'The final Quark Hepteract Improver',
      'quark hept inf',
      7777,
      'ShopImprovedQuarkHepteractInfinity'
    )
  ]
}

export const shopLuckSection: SectionData = {
  title: 'Shop Upgrades: Ambrosia Luck',
  statCards: true,
  items: [
    shopStat('shopLuck1', 'Ambrosia Luck Increaser', 'shop luck 1', 40, 'ShopAmbrosiaLuck1'),
    shopStat('shopLuck2', 'A better Ambrosia Luck Increaser', 'shop luck 2', 50, 'ShopAmbrosiaLuck2'),
    shopStat('shopLuck3', 'Another Ambrosia Luck Increaser', 'shop luck 3', 60, 'ShopAmbrosiaLuck3'),
    shopStat('shopLuck4', 'A FINAL Ambrosia Luck Increaser', 'shop luck 4', 1000, 'ShopAmbrosiaLuck4')
  ]
}

export const shopRedLuckSection: SectionData = {
  title: 'Shop Upgrades: Red Ambrosia Luck',
  statCards: true,
  items: [
    shopStat('shopRedLuck1', 'Low Class Dice of Asmodeus', 'shop red luck 1', 40),
    shopStat('shopRedLuck2', 'Dice of Asmodeus', 'shop red luck 2', 50),
    shopStat('shopRedLuck3', 'High Class Dice of Asmodeus', 'shop red luck 3', 60),
    shopStat('shopRedLuck4', 'Elite Class Dice of Asmodeus', 'shop red luck 4', 1000)
  ]
}

export const shopAmbGenSection: SectionData = {
  title: 'Shop Upgrades: Ambrosia Generation',
  statCards: true,
  items: [
    shopStat('shopAmbGen1', 'Ambrosia Generation Speedup', 'shop amb gen 1', 40, 'ShopAmbrosiaGeneration1'),
    shopStat('shopAmbGen2', 'A better Ambrosia Generation Speedup', 'shop amb gen 2', 50, 'ShopAmbrosiaGeneration2'),
    shopStat('shopAmbGen3', 'Another Ambrosia Generation Speedup', 'shop amb gen 3', 60, 'ShopAmbrosiaGeneration3'),
    shopStat('shopAmbGen4', 'A FINAL Ambrosia Generation Speedup', 'shop amb gen 4', 1000, 'ShopAmbrosiaGeneration4')
  ]
}

export const shopSingularitySection: SectionData = {
  title: 'Shop Upgrades: Singularity',
  statCards: true,
  items: [
    shopStat(
      'shopSingularityReducer',
      'A Singularity Tenderizer',
      'shop singularity reducer',
      4,
      'ShopSingularityPenaltyDebuff'
    )
  ]
}

export const ascensionSection: SectionData = {
  title: 'Ascension',
  statCards: false,
  items: [
    {
      field: 'ascensionSpeed',
      title: 'Ascension Speed',
      src: 'https://synergism.cc/Pictures/PseudoShop/ASCENSIONTimeSkip.png',
      alt: 'ascension speed',
      type: 'number',
      min: 0,
      max: 1e300
    },
    {
      field: 'ascensionSpread',
      title: 'Ascension Speed Spread',
      src: 'https://synergism.cc/Pictures/Default/SingularityAscensionSpeed.png',
      alt: 'ascension spread',
      type: 'number',
      min: 0,
      max: 1
    },
    {
      field: 'transcription',
      title: 'Infinite Transcription of the One Mind',
      src: 'https://synergism.cc/Pictures/img_transparent.png',
      alt: 'transcription',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      placeholder: 'Level'
    }
  ]
}

const cubeStat = (field: string, title: string, src: string, alt: string): StatData => ({
  field,
  title,
  src: `https://synergism.cc/Pictures/Default/${src}.png`,
  alt,
  type: 'number',
  placeholder: 'Amount',
  min: 0,
  max: 1e300
})

export const cubeStats: StatData[] = [
  cubeStat('cubes', 'Cubes', 'WowCube', '3D'),
  cubeStat('tesseracts', 'Tesseracts', 'WowTessaract', '4D'),
  cubeStat('hypercubes', 'Hypercubes', 'WowHypercube', '5D'),
  cubeStat('platonicCubes', 'Platonic Cubes', 'PlatonicCube', '6D'),
  cubeStat('hepteracts', 'Hepteracts', 'Hepteract', '7D'),
  cubeStat('octeracts', 'Octeracts', 'Octeract', '8D')
]

const hepteractStat = (field: string, title: string): StatData => ({
  field,
  title,
  src: 'https://synergism.cc/Pictures/img_transparent.png',
  alt: title.toLowerCase(),
  type: 'number',
  placeholder: 'Amount',
  min: 0,
  max: 1e300
})

export const hepteractRow1: StatData[] = [
  hepteractStat('chronosHepteract', 'Chronos Hepteract'),
  hepteractStat('hypercubeHepteract', 'Hypercube Hepteract'),
  hepteractStat('quarkHepteract', 'Quark Hepteract'),
  hepteractStat('challengeHepteract', 'Challenge Hepteract')
]

export const hepteractRow2: StatData[] = [
  hepteractStat('abyssHepteract', 'Abyss Hepteract'),
  hepteractStat('acceleratorHepteract', 'Accelerator Hepteract'),
  hepteractStat('acceleratorBoostHepteract', 'Accelerator Boost Hepteract'),
  hepteractStat('multiplierHepteract', 'Multiplier Hepteract')
]

export const hepteractRow3: StatData[] = [
  hepteractStat('overfluxPowder', 'Overflux Powder')
]

export const singularitySection: SectionData = {
  title: 'Singularity',
  statCards: false,
  items: [
    {
      field: 'currentSingularity',
      title: 'Current Singularity',
      src: 'https://synergism.cc/Pictures/Achievements/Grouped/SingularityCount.png',
      alt: 'singularity',
      type: 'number',
      min: 0,
      max: 300
    },
    {
      field: 'currentExalt',
      title: 'Current Exalt',
      src: 'https://synergism.cc/Pictures/Achievements/Progressive/Exalts.png',
      alt: 'exalt',
      type: 'select',
      options: [
        { value: 0, title: 'None', label: 'None' },
        { value: 1, title: 'No Golden Quark Upgrades' },
        { value: 2, title: 'One Challenge Caps' },
        { value: 3, title: 'Limited Ascensions Challenge' },
        { value: 4, title: 'Disappearance of a Salesman' },
        { value: 5, title: 'No Octeract Upgrades' },
        { value: 6, title: 'No Ambrosia Upgrades' },
        { value: 7, title: 'The Grand Singularity Speedrun' },
        { value: 8, title: 'SADISTIC EXALT III - The Prequel' },
        { value: 9, title: "The Taxman's Last Stand" },
        { value: 10, title: 'Bar Charging' }
      ]
    }
  ]
}

const ambrosiaStat = (
  field: string, title: string, placeholder?: string, src?: string, alt?: string, step?: number
): StatData => ({
  field,
  title,
  src: src ? `https://synergism.cc/Pictures/${src}.png` : undefined,
  alt,
  type: 'number',
  min: 0,
  max: 1e300,
  step,
  placeholder
})

export const ambrosiaSection: SectionData = {
  title: 'Ambrosia',
  statCards: false,
  items: [
    ambrosiaStat('lifetimeAmbrosia', 'Lifetime Ambrosia', 'Amount', 'Default/Ambrosia', 'ambrosia', 1),
    ambrosiaStat('lifetimeRedAmbrosia', 'Lifetime Red Ambrosia', 'Amount', 'RedAmbrosia/RedAmbrosia', 'red ambrosia', 1),
    ambrosiaStat(
      'ambrosiaBarPoints',
      'Ambrosia Bar Points',
      'Per Second',
      'PseudoShop/AMBROSIATimeSkip',
      'ambrosia speed'
    ),
    ambrosiaStat('redBarPoints', 'Red Bar Points', 'Per Second', 'img_transparent'),
    ambrosiaStat('blueberries', 'Blueberries', 'Amount', 'Default/Blueberries', 'blueberry', 1),
    ambrosiaStat('baseLuck', 'Base Luck', undefined, 'Default/ShopAmbrosiaLuck1', 'luck'),
    ambrosiaStat('redLuck', 'Red Luck', undefined, 'img_transparent', 'red luck'),
    ambrosiaStat(
      'luckConversion',
      'Luck Conversion',
      undefined,
      'RedAmbrosia/RedAmbrosiaConversionImprovement1',
      'luck conversion'
    )
  ]
}

const ambrosiaModuleStat = (title: string, field: string, src: string, maxLevel = 1): StatData => {
  baseStats[field] = maxLevel > 1 ? 0 : false

  return {
    field,
    title,
    src: `https://synergism.cc/Pictures/${src}.png`,
    type: maxLevel > 1 ? 'number' : 'checkbox',
    min: maxLevel > 1 ? 0 : undefined,
    max: maxLevel > 1 ? maxLevel : undefined,
    step: maxLevel > 1 ? 1 : undefined,
    placeholder: maxLevel > 1 ? 'Level' : undefined
  }
}

export const redAmbrosiaSection: SectionData = {
  title: 'Red Ambrosia Modules',
  statCards: false,
  items: [
    ambrosiaModuleStat(
      'A beginners guide to Red Ambrosia',
      'tutorial',
      'RedAmbrosia/RedAmbrosiaTutorial',
      100
    ),
    ambrosiaModuleStat('Viscount of Ruby Guy', 'viscount', 'RedAmbrosia/RedAmbrosiaViscount'),
    ambrosiaModuleStat(
      'Yin and Yang: Salvage Edition',
      'salvageYinYang',
      'RedAmbrosia/RedAmbrosiaSalvageYinYang',
      100
    ),
    ambrosiaModuleStat(
      'More Blueberry Tutorial Module Levels!',
      'freeTutorialLevels',
      'RedAmbrosia/RedAmbrosiaFreeTutorialLevels',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Luck Module Levels!',
      'freeLevelsRow2',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow2',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Resource and Utility Module Levels!',
      'freeLevelsRow3',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow3',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Cube Module Levels!',
      'freeLevelsRow4',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow4',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Quark Module Levels!',
      'freeLevelsRow5',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow5',
      5
    ),
    ambrosiaModuleStat('Cubes "made" of Red Ambrosia', 'redAmbrosiaCube', 'RedAmbrosia/RedAmbrosiaRedAmbrosiaCube'),
    ambrosiaModuleStat(
      'Hire Red Ambrosia Artisans',
      'redAmbrosiaCubeImprover',
      'RedAmbrosia/RedAmbrosiaRedAmbrosiaCubeImprover',
      20
    ),
    ambrosiaModuleStat('Obtainium ""made"" of Red Ambrosia', 'redAmbrosiaObtainium', 'RedAmbrosia/RedAmbrosiaObtainium'),
    ambrosiaModuleStat('Offerings """made""" of Red Ambrosia', 'redAmbrosiaOffering', 'RedAmbrosia/RedAmbrosiaOffering'),
    ambrosiaModuleStat(
      'The Feast and the Famine',
      'freeOfferingUpgrades',
      'RedAmbrosia/RedAmbrosiaFreeOfferingUpgrades',
      5
    ),
    ambrosiaModuleStat('Weird Science', 'freeObtainiumUpgrades', 'RedAmbrosia/RedAmbrosiaFreeObtainiumUpgrades', 5),
    ambrosiaModuleStat("Livin' in a Box", 'freeCubeUpgrades', 'RedAmbrosia/RedAmbrosiaFreeCubeUpgrades', 5),
    ambrosiaModuleStat('The Distance', 'freeSpeedUpgrades', 'RedAmbrosia/RedAmbrosiaFreeSpeedUpgrades', 5),
    ambrosiaModuleStat(
      'Red Infinity Shop Voucher',
      'infiniteShopUpgrades',
      'RedAmbrosia/RedAmbrosiaInfiniteShopLevels',
      40
    ),
    ambrosiaModuleStat(
      'Red Digital Octeract Accumulator Accumulator',
      'redAmbrosiaFreeAccumulator',
      'RedAmbrosia/RedAmbrosiaFreeAccumulator',
      10
    ),
    ambrosiaModuleStat('The Dice that Decide Your Fate', 'redAmbrosiaRedLuck', 'RedAmbrosia/RedAmbrosiaRedLuck', 100),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement',
      'conversionImprovement1',
      'RedAmbrosia/RedAmbrosiaConversionImprovement1',
      5
    ),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement II: The Red Electric Boogaloo',
      'conversionImprovement2',
      'RedAmbrosia/RedAmbrosiaConversionImprovement2',
      3
    ),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement III and a half',
      'conversionImprovement3',
      'RedAmbrosia/RedAmbrosiaConversionImprovement3',
      2
    ),
    ambrosiaModuleStat('Ossified Blueberry Tactics', 'regularLuck', 'RedAmbrosia/RedAmbrosiaRegularLuck', 100),
    ambrosiaModuleStat(
      'Ossified Blueberry Tactics II',
      'regularLuck2',
      'RedAmbrosia/RedAmbrosiaRegularLuck2',
      250
    ),
    ambrosiaModuleStat(
      'The Sands of Time',
      'blueberryGenerationSpeed',
      'RedAmbrosia/RedAmbrosiaBlueberryGenerationSpeed',
      100
    ),
    ambrosiaModuleStat(
      'The Sands of Time II',
      'blueberryGenerationSpeed2',
      'RedAmbrosia/RedAmbrosiaBlueberryGenerationSpeed2',
      250
    ),
    ambrosiaModuleStat('Berries that are... blue?', 'redAmbrosiaBlueberries', 'RedAmbrosia/RedAmbrosiaBlueberries', 5),
    ambrosiaModuleStat(
      'Millennium-Aged Red Ambrosia',
      'redGenerationSpeed',
      'RedAmbrosia/RedAmbrosiaRedGenerationSpeed',
      100
    ),
    ambrosiaModuleStat('Era of Red Ambrosia', 'redGenerationSpeed2', 'RedAmbrosia/RedAmbrosiaRedGenerationSpeed2', 250),
    ambrosiaModuleStat('Red-Blue Ultrafusion', 'redAmbrosiaAccelerator', 'RedAmbrosia/RedAmbrosiaAccelerator', 100)
  ]
}

export const enchantmentSection: SectionData = {
  title: 'Ambrosia Module Enchantments',
  statCards: false,
  items: [
    ambrosiaModuleStat('Ambrosia Tutorial Module', 'ambrosiaTutorial', 'Default/BlueberryTutorial', 5),
    ambrosiaModuleStat('Ambrosia Quark Module I', 'ambrosiaQuarks1', 'Default/BlueberryQuarks', 10),
    ambrosiaModuleStat('Ambrosia Quark Module II', 'ambrosiaQuarks2', 'Default/BlueberryQuarks2'),
    ambrosiaModuleStat('Ambrosia Quark Module III', 'ambrosiaQuarks3', 'Default/BlueberryQuarks3'),
    ambrosiaModuleStat('Ambrosia Quark Capstone', 'ambrosiaQuarks4', 'Default/BlueberryQuarks4'),
    ambrosiaModuleStat('Mechanical - the 1981 Cut', 'ambrosiaFreeQuarkUpgrades', 'Default/BlueberryFreeQuarkUpgrades'),
    ambrosiaModuleStat(
      'Shameless, Ambrosial Subscriber Advertisement',
      'ambrosiaPatreon',
      'Default/BlueberryPatreon'
    ),
    ambrosiaModuleStat('Ambrosia Cube Module I', 'ambrosiaCubes1', 'Default/BlueberryCubes', 10),
    ambrosiaModuleStat('Ambrosia Cube Module II', 'ambrosiaCubes2', 'Default/BlueberryCubes2'),
    ambrosiaModuleStat('Ambrosia Cube Module III', 'ambrosiaCubes3', 'Default/BlueberryCubes3'),
    ambrosiaModuleStat('Ambrosia Cube^4', 'ambrosiaCubes4', 'Default/BlueberryCubes4'),
    ambrosiaModuleStat('Silent Cube', 'ambrosiaFreeCubeUpgrades', 'Default/BlueberryFreeCubeUpgrades', 15),
    ambrosiaModuleStat('The Brick of Lead', 'ambrosiaBrickOfLead', 'Default/BlueberryBrickOfLead'),
    ambrosiaModuleStat('Ambrosia Luck Module I', 'ambrosiaLuck1', 'Default/BlueberryLuck', 10),
    ambrosiaModuleStat('Ambrosia Luck Module II', 'ambrosiaLuck2', 'Default/BlueberryLuck2'),
    ambrosiaModuleStat('Ambrosia Luck Module III', 'ambrosiaLuck3', 'Default/BlueberryLuck3'),
    ambrosiaModuleStat('The Eight Leaf Clover', 'ambrosiaLuck4', 'Default/BlueberryLuck4'),
    ambrosiaModuleStat(
      'The Green, Green Grass of Ambrosia',
      'ambrosiaFreeLuckUpgrades',
      'Default/BlueberryFreeLuckUpgrades',
      10
    ),
    ambrosiaModuleStat('The Gambler', 'ambrosiaFreeRedLuckUpgrades', 'Default/BlueberryFreeRedLuckUpgrades', 25),
    ambrosiaModuleStat('Time in a Bottle', 'ambrosiaFreeGenerationUpgrades', 'Default/BlueberryFreeGenerationLevels', 2),
    ambrosiaModuleStat('TWO MIND', 'twoMind', 'Default/BlueberryMind'),
    ambrosiaModuleStat('Ambrosia Cube-Quark Hybrid Module I', 'ambrosiaCubeQuark1', 'Default/BlueberryCubeQuark'),
    ambrosiaModuleStat('Ambrosia Luck-Quark Hybrid Module I', 'ambrosiaLuckQuark1', 'Default/BlueberryLuckQuark'),
    ambrosiaModuleStat('Ambrosia Quark-Cube Hybrid Module I', 'ambrosiaQuarkCube1', 'Default/BlueberryQuarkCube'),
    ambrosiaModuleStat('Ambrosia Luck-Cube Hybrid Module I', 'ambrosiaLuckCube1', 'Default/BlueberryLuckCube'),
    ambrosiaModuleStat('Ambrosia Quark-Luck Hybrid Module I', 'ambrosiaQuarkLuck1', 'Default/BlueberryQuarkLuck'),
    ambrosiaModuleStat('Ambrosia Cube-Luck Hybrid Module I', 'ambrosiaCubeLuck1', 'Default/BlueberryCubeLuck'),
    ambrosiaModuleStat('RNG-based Obtainium Booster', 'ambrosiaObtainium1', 'Default/BlueberryObtainium'),
    ambrosiaModuleStat('Basic Obtainium Booster', 'ambrosiaBaseObtainium1', 'Default/BlueberryBaseObtainium1', 20),
    ambrosiaModuleStat('Based Obtainium Booster', 'ambrosiaBaseObtainium2', 'Default/BlueberryBaseObtainium2'),
    ambrosiaModuleStat('Blinded by Science', 'ambrosiaFreeObtainiumUpgrades', 'Default/BlueberryFreeObtainiumUpgrades', 25),
    ambrosiaModuleStat('RNG-based Offerings Booster', 'ambrosiaOffering1', 'Default/BlueberryOffering'),
    ambrosiaModuleStat('Basic Offerings Booster', 'ambrosiaBaseOffering1', 'Default/BlueberryBaseOffering1', 40),
    ambrosiaModuleStat('Based Offerings Booster', 'ambrosiaBaseOffering2', 'Default/BlueberryBaseOffering2'),
    ambrosiaModuleStat('Youthful Cannibals', 'ambrosiaFreeOfferingUpgrades', 'Default/BlueberryFreeOfferingUpgrades', 25),
    ambrosiaModuleStat(
      'Hyperfluxed Wow! Cube Industrial Production',
      'ambrosiaHyperflux',
      'Default/BlueberryHyperflux'
    ),
    ambrosiaModuleStat('Singularity Stabilizer Module', 'ambrosiaSingReduction1', 'Default/BlueberrySingReduction'),
    ambrosiaModuleStat(
      'Exo-Chromatic Kinetic Post-Modulated Singularity Stabilizer Module',
      'ambrosiaSingReduction2',
      'Default/BlueberrySingReduction2'
    ),
    ambrosiaModuleStat(
      'Talisman Ambrosia Embedding Module',
      'ambrosiaTalismanBonusRuneLevel',
      'Default/BlueberryTalismanBonusRuneLevel',
      20
    ),
    ambrosiaModuleStat('Rune Coefficient Module', 'ambrosiaRuneOOMBonus', 'Default/BlueberryRuneOOMBonus', 20),
    ambrosiaModuleStat('Indigo Infinity Shop Voucher', 'ambrosiaInfiniteShopUpgrades1', 'Default/BlueberryInfiniteShopUpgrades'),
    ambrosiaModuleStat(
      'Violet Infinity Shop Voucher',
      'ambrosiaInfiniteShopUpgrades2',
      'Default/BlueberryInfiniteShopUpgrades2',
      8
    ),
    ambrosiaModuleStat(
      'Periwinkle Infinity Shop Voucher',
      'ambrosiaInfiniteShopUpgrades3',
      'Default/BlueberryInfiniteShopUpgrades3',
      8
    )
  ]
}

export const allStats: Record<string, DecimalSource | boolean | undefined> = reactive(
  { ...baseStats }
)

for (const [name, value] of Object.entries(allStats)) {
  if (name !== 'currentExalt' && (typeof value === 'number' || value instanceof Decimal))
    allStats[name] = undefined
}

const cubeNames = ['cubes', 'tesseracts', 'hypercubes', 'platonicCubes', 'hepteracts', 'octeracts']
const calculateCubes = (stats: typeof allStats) => {
  let cubesTotal: number | string = 6
  for (const name of cubeNames) {
    if (stats[name] === 'FAIL') {
      cubesTotal = 'FAIL'
      break
    }
    cubesTotal += Math.floor(Math.log10(Number(stats[name] ?? 0) + 1))
  }
  return cubesTotal
}

export const updateCubes = (stats = allStats) => {
  stats.cubesTotal = calculateCubes(stats)

  const element = DOMCacheGetOrSet('cubes-total')
  if (element instanceof HTMLInputElement)
    element.value = String(stats.cubesTotal)

  for (const stat of cubeStats)
    DOMCacheGetOrSet(toKebabCase(stat.field)).parentElement?.classList.remove('stale')
}

export const addStatListeners = () => {
  for (const name of Object.keys(allStats)) {
    const element = DOMCacheGetOrSet(toKebabCase(name))
    if (!element)
      continue

    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      element.addEventListener('change', () => {
        allStats[name] = element.checked
        saveStats()
      })
    } else if (cubeStats.some(entry => entry.field === name)) {
      element.addEventListener('change', saveCubes)
    } else {
      element.addEventListener('change', saveStats)
    }
  }

  DOMCacheGetOrSet('cubes-total')?.addEventListener('change', () => {
    for (const stat of cubeStats)
      DOMCacheGetOrSet(toKebabCase(stat.field)).parentElement?.classList.add('stale')
  })

  // If the user closes a tab while editing a field, that newer value is not stored
  // That's intended, the value might be invalid, and it doesn't take long to re-enter it
  window.addEventListener('pagehide', () => {
    if (saveTimer !== undefined && getStatsTimestamp() <= lastEdit)
      writeStats()
  })
}

// Import always immediately overrides saved stats and updates lastTimestamp
// Editing any field also always does it, but with a 60-second delay
// Closing a tab only overrides saved stats if newer data is not saved already
// Editing any field makes the data count as newer
let lastEdit = 0
let lastTimestamp = Date.now()
let saveTimer: ReturnType<typeof setTimeout> | undefined

export const writeStats = () => {
  clearTimeout(saveTimer)
  saveTimer = undefined
  try {
    const timestamp = Date.now()
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(allStats))
    localStorage.setItem(STATS_STORAGE_TIMESTAMP_KEY, String(timestamp))
    lastEdit = 0
    lastTimestamp = timestamp
  } catch (error) {
    setTimeout(writeStats, SAVE_INTERVAL)
    console.error('Unable to save stats to local storage:', error)
  }
}

export const saveStats = () => {
  lastEdit = Date.now()
  if (saveTimer !== undefined)
    return

  const delay = SAVE_INTERVAL - (lastEdit - lastTimestamp)
  if (delay <= 0)
    writeStats()
  else
    saveTimer = setTimeout(writeStats, delay)
}

const saveCubes = () => {
  updateCubes()
  saveStats()
}

const getStatsTimestamp = () => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_TIMESTAMP_KEY)
    return Number(stored ?? -1)
  } catch {
    return -1
  }
}

export const loadStats = () => {
  lastEdit = 0
  lastTimestamp = Date.now()
  let saved: unknown
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY)
    if (stored === null)
      return
    saved = JSON.parse(stored) as unknown
  } catch (error) {
    console.error('Unable to load stats from local storage:', error)
    return
  }

  if (saved === null || typeof saved !== 'object' || Array.isArray(saved))
    return

  for (const [name, value] of Object.entries(saved)) {
    if (!Object.hasOwn(baseStats, name))
      continue

    const element = DOMCacheGetOrSet(toKebabCase(name))
    if (value === 'FAIL') {
      allStats[name] = 'FAIL'
      if (element instanceof HTMLInputElement && typeof baseStats[name] !== 'boolean') {
        element.parentElement?.classList.add('error')
        element.value = 'FAIL'
      } else {
        element.classList.add('error')
      }
      continue
    }

    const type = typeof value
    const baseType = typeof baseStats[name]

    if (baseStats[name] instanceof Decimal && (type === 'number' || type === 'string')) {
      try {
        // 'FAIL' was covered before, any other invalid string will throw
        allStats[name] = new Decimal(value)
      } catch {
        allStats[name] = baseStats[name]
        continue
      }
    } else if (baseType === type && (type === 'number' || type === 'boolean')) {
      // All values are either 'FAIL', decimals, numbers or booleans
      // The first two cases were covered before
      allStats[name] = value
    } else {
      allStats[name] = baseStats[name]
      continue
    }

    // All valid elements should be either inputs of comboboxes
    if (!(element instanceof HTMLInputElement || element instanceof HTMLButtonElement))
      continue

    // Check bounds
    if (baseType === 'number') {
      if (element instanceof HTMLInputElement) {
        const min = element.min === '' ? Number.NEGATIVE_INFINITY : Number(element.min)
        const max = element.max === '' ? Number.POSITIVE_INFINITY : Number(element.max)
        allStats[name] = Math.clamp(value, min, max)
      } else if (name === 'currentExalt') {
        allStats[name] = (Number.isInteger(value) && (0 <= value && value <= 10)) ? value : 0
      }
    }

    // Comboboxes update displayed values dynamically
    if (element instanceof HTMLButtonElement)
      continue

    // Update displayed value
    if (type === 'boolean') {
      element.checked = value
    } else {
      element.value = String(allStats[name])
      element.dispatchEvent(new Event('change')) // Formats numbers
    }
  }

  if ((allStats.cubesTotal ?? 6) !== calculateCubes(allStats)) {
    for (const stat of cubeStats)
      DOMCacheGetOrSet(toKebabCase(stat.field)).parentElement?.classList.add('stale')
  }
}
