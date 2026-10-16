import { toKebabCase } from "../utilities"
import type { SectionData, StatData } from "./types"

export const genericSection: SectionData = {
  title: 'Generic Stats',
  statCards: false,
  items: [
    {
      title: 'Base Obtainium',
      src: 'https://synergism.cc/Pictures/Default/BlueberryBaseObtainium1.png',
      alt: 'obt',
      id: 'obt-base',
      type: 'number',
      min: 1,
      step: 1
    },
    {
      title: 'Base Offerings',
      src: 'https://synergism.cc/Pictures/Default/BlueberryBaseOffering1.png',
      alt: 'off',
      id: 'off-base',
      type: 'number',
      min: 1,
      step: 1
    },
    {
      title: 'Quarks',
      src: 'https://synergism.cc/Pictures/Default/Quark.png',
      alt: 'quark',
      id: 'quarks',
      type: 'number',
      placeholder: 'Amount',
      min: 0
    }
  ]
}

export const pseudoCoinSection: SectionData = {
  title: 'PseudoCoins',
  statCards: false,
  items: [
    {
      title: 'Generous Subscribers Bonus',
      src: 'https://synergism.cc/Pictures/PseudoShop/GOLDEN_QUARK_BUFF.png',
      alt: 'store icon',
      id: 'subscribers-bonus',
      type: 'number',
      min: 0,
      placeholder: 'Percent'
    },
    {
      title: 'Personal Subscription Bonus',
      id: 'personal-subscription-bonus',
      type: 'number',
      min: 0,
      placeholder: 'Percent'
    },
    {
      title: 'Active Bells',
      src: 'https://synergism.cc/Pictures/PseudoShop/HAPPY_HOUR_BELL.png',
      alt: 'bell',
      id: 'active-bells',
      type: 'number',
      min: 0,
      step: 1
    }
  ]
}

const runeStat = (title: string, id: string, src?: string, alt?: string): StatData => ({
  title,
  src: src ? `https://synergism.cc/Pictures/Runes/${src}.png` : undefined,
  alt,
  id,
  type: 'number',
  min: 0
})

export const runeSIStats: StatData[] = [
  runeStat('Superior Intellect Rune EXP', 'rune-si-exp', 'SuperiorIntellect', 'rune SI'),
  runeStat('Rune Coefficient', 'rune-si-coef'),
  runeStat('Bonus Levels', 'rune-si-bonus')
]

export const runeIAStats: StatData[] = [
  runeStat('Infinite Ascent Rune EXP', 'rune-ia-exp', 'InfiniteAscent', 'rune SI'),
  runeStat('Total Bonus Levels', 'rune-ia-bonus'),
  runeStat('Bonus Levels from Talismans', 'rune-ia-talisman')
]

export const runeAoAGStats: StatData[] = [
  {
    title: 'Antiquities of the Ant God acquired',
    src: 'https://synergism.cc/Pictures/Runes/Antiquities.png',
    alt: 'antiquities',
    id: 'rune-aoag',
    type: 'checkbox'
  }
]

export const talismanPowerStat: StatData = {
  title: 'Talisman Power',
  id: 'talisman-power',
  src: 'https://synergism.cc/Pictures/img_transparent.png',
  alt: 'talisman',
  type: 'number',
  min: 1
}

const shopStat = (title: string, alt: string, max: number, src?: string): StatData => ({
  title,
  src: `https://synergism.cc/Pictures/${src ? `Default/${src}` : 'img_transparent'}.png`,
  alt,
  id: toKebabCase(alt),
  type: 'number',
  placeholder: 'Level',
  min: 0,
  max,
  step: 3
})

export const shopHepteractSection: SectionData = {
  title: 'Shop Upgrades: Quark Hepteracts',
  statCards: true,
  items: [
    shopStat('Quark Hepteract 1', 'quark hept 1', 10, 'ShopImprovedQuarkHepteract0'),
    shopStat('Quark Hepteract 2', 'quark hept 2', 10, 'ShopImprovedQuarkHepteract'),
    shopStat('Quark Hepteract 3', 'quark hept 3', 10, 'ShopImprovedQuarkHepteract2'),
    shopStat('Quark Hepteract 4', 'quark hept 4', 10, 'ShopImprovedQuarkHepteract3'),
    shopStat(
      'The final Quark Hepteract Improver',
      'quark hept 1',
      7777,
      'ShopImprovedQuarkHepteractInfinity'
    )
  ]
}

export const shopLuckSection: SectionData = {
  title: 'Shop Upgrades: Ambrosia Luck',
  statCards: true,
  items: [
    shopStat('Ambrosia Luck Increaser', 'shop luck 1', 40, 'ShopAmbrosiaLuck1'),
    shopStat('A better Ambrosia Luck Increaser', 'shop luck 2', 50, 'ShopAmbrosiaLuck2'),
    shopStat('Another Ambrosia Luck Increaser', 'shop luck 3', 60, 'ShopAmbrosiaLuck3'),
    shopStat('A FINAL Ambrosia Luck Increaser', 'shop luck 4', 1000, 'ShopAmbrosiaLuck4')
  ]
}

export const shopRedLuckSection: SectionData = {
  title: 'Shop Upgrades: Red Ambrosia Luck',
  statCards: true,
  items: [
    shopStat('Low Class Dice of Asmodeus', 'shop red luck 1', 40),
    shopStat('Dice of Asmodeus', 'shop red luck 2', 50),
    shopStat('High Class Dice of Asmodeus', 'shop red luck 3', 60),
    shopStat('Elite Class Dice of Asmodeus', 'shop red luck 4', 1000)
  ]
}

export const shopAmbGenSection: SectionData = {
  title: 'Shop Upgrades: Ambrosia Generation',
  statCards: true,
  items: [
    shopStat('Ambrosia Generation Speedup', 'shop amb gen 1', 40, 'ShopAmbrosiaGeneration1'),
    shopStat('A better Ambrosia Generation Speedup', 'shop amb gen 2', 50, 'ShopAmbrosiaGeneration2'),
    shopStat('Another Ambrosia Generation Speedup', 'shop amb gen 3', 60, 'ShopAmbrosiaGeneration3'),
    shopStat('A FINAL Ambrosia Generation Speedup', 'shop amb gen 4', 1000, 'ShopAmbrosiaGeneration4')
  ]
}

export const shopSingularitySection: SectionData = {
  title: 'Shop Upgrades: Singularity',
  statCards: true,
  items: [
    shopStat(
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
      title: 'Ascension Speed',
      src: 'https://synergism.cc/Pictures/PseudoShop/ASCENSIONTimeSkip.png',
      alt: 'ascension speed',
      id: 'ascension-speed',
      type: 'number',
      min: 0
    },
    {
      title: 'Ascension Speed Spread',
      src: 'https://synergism.cc/Pictures/Default/SingularityAscensionSpeed.png',
      alt: 'ascension spread',
      id: 'ascension-spread',
      type: 'number',
      min: 0,
      max: 1
    },
    {
      title: 'Infinite Transcription of the One Mind',
      src: 'https://synergism.cc/Pictures/img_transparent.png',
      alt: 'transcription',
      id: 'transcription',
      type: 'number',
      min: 0,
      max: 20,
      step: 1,
      placeholder: 'Level'
    }
  ]
}

const cubeStat = (title: string, src: string, alt: string): StatData => ({
  title,
  src: `https://synergism.cc/Pictures/Default/${src}.png`,
  alt,
  id: toKebabCase(title),
  type: 'number',
  placeholder: 'Amount',
  min: 0
})

export const cubeStats: StatData[] = [
  cubeStat('Cubes', 'WowCube', '3D'),
  cubeStat('Tesseracts', 'WowTessaract', '4D'),
  cubeStat('Hypercubes', 'WowHypercube', '5D'),
  cubeStat('Platonic Cubes', 'PlatonicCube', '6D'),
  cubeStat('Hepteracts', 'Hepteract', '7D'),
  cubeStat('Octeracts', 'Octeract', '8D')
]

const hepteractStat = (title: string): StatData => ({
  title,
  src: 'https://synergism.cc/Pictures/img_transparent.png',
  alt: title.toLowerCase(),
  id: toKebabCase(title),
  type: 'number',
  placeholder: 'Amount',
  min: 0
})

export const hepteractRow1: StatData[] = [
  hepteractStat('Chronos Hepteract'),
  hepteractStat('Hypercube Hepteract'),
  hepteractStat('Quark Hepteract'),
  hepteractStat('Challenge Hepteract')
]

export const hepteractRow2: StatData[] = [
  hepteractStat('Abyss Hepteract'),
  hepteractStat('Accelerator Hepteract'),
  hepteractStat('Accelerator Boost Hepteract'),
  hepteractStat('Multiplier Hepteract')
]

export const hepteractRow3: StatData[] = [
  hepteractStat('Overflux Powder')
]

export const singularitySection: SectionData = {
  title: 'Singularity',
  statCards: false,
  items: [
    {
      title: 'Current Singularity',
      src: 'https://synergism.cc/Pictures/Achievements/Grouped/SingularityCount.png',
      alt: 'singularity',
      id: 'current-singularity',
      type: 'number',
      min: 0,
      max: 300
    },
    {
      title: 'Current Exalt',
      src: 'https://synergism.cc/Pictures/Achievements/Progressive/Exalts.png',
      alt: 'exalt',
      id: 'current-exalt',
      type: 'select',
      options: [
        { title: 'None', label: 'None', selected: true },
        { value: 1, title: 'No Golden Quark Upgrades', label: '1' },
        { value: 2, title: 'One Challenge Caps', label: '2' },
        { value: 3, title: 'Limited Ascensions Challenge', label: '3' },
        { value: 4, title: 'Disappearance of a Salesman', label: '4' },
        { value: 5, title: 'No Octeract Upgrades', label: '5' },
        { value: 6, title: 'No Ambrosia Upgrades', label: '6' },
        { value: 7, title: 'The Grand Singularity Speedrun', label: '7' },
        { value: 8, title: 'SADISTIC EXALT III - The Prequel', label: '8' },
        { value: 9, title: "The Taxman's Last Stand", label: '9' },
        { value: 10, title: 'Bar Charging', label: '10' }
      ]
    }
  ]
}

const ambrosiaStat = (
  title: string, placeholder?: string, src?: string, alt?: string, step?: number
): StatData => ({
  title,
  src: src ? `https://synergism.cc/Pictures/${src}.png` : undefined,
  alt,
  id: toKebabCase(title),
  type: 'number',
  min: 0,
  step,
  placeholder
})

export const ambrosiaSection: SectionData = {
  title: 'Ambrosia',
  statCards: false,
  items: [
    ambrosiaStat('Lifetime Ambrosia', 'Amount', 'Default/Ambrosia', 'ambrosia', 1),
    ambrosiaStat('Lifetime Red Ambrosia', 'Amount', 'RedAmbrosia/RedAmbrosia', 'red ambrosia', 1),
    ambrosiaStat(
      'Ambrosia Bar Points',
      'Per Second',
      'PseudoShop/AMBROSIATimeSkip',
      'ambrosia speed'
    ),
    ambrosiaStat('Red Bar Points', 'Per Second', 'img_transparent'),
    ambrosiaStat('Blueberries', 'Amount', 'Default/Blueberries', 'blueberry', 1),
    ambrosiaStat('Base Luck', undefined, 'Default/ShopAmbrosiaLuck1', 'luck'),
    ambrosiaStat('Red Luck', undefined, 'img_transparent', 'red luck'),
    ambrosiaStat(
      'Luck Conversion',
      undefined,
      'RedAmbrosia/RedAmbrosiaConversionImprovement1',
      'luck conversion'
    )
  ]
}

const ambrosiaModuleStat = (title: string, src: string, maxLevel = 1): StatData => ({
  title,
  src: `https://synergism.cc/Pictures/${src}.png`,
  id: toKebabCase(src),
  type: maxLevel > 1 ? 'number' : 'checkbox',
  min: maxLevel > 1 ? 0 : undefined,
  max: maxLevel > 1 ? maxLevel : undefined,
  step: maxLevel > 1 ? 1 : undefined,
  placeholder: maxLevel > 1 ? 'Level' : undefined
})

export const redAmbrosiaSection: SectionData = {
  title: 'Red Ambrosia Modules',
  statCards: false,
  items: [
    ambrosiaModuleStat(
      'A beginners guide to Red Ambrosia',
      'RedAmbrosia/RedAmbrosiaTutorial',
      100
    ),
    ambrosiaModuleStat('Viscount of Ruby Guy', 'RedAmbrosia/RedAmbrosiaViscount'),
    ambrosiaModuleStat(
      'Yin and Yang: Salvage Edition',
      'RedAmbrosia/RedAmbrosiaSalvageYinYang',
      100
    ),
    ambrosiaModuleStat(
      'More Blueberry Tutorial Module Levels!',
      'RedAmbrosia/RedAmbrosiaFreeTutorialLevels',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Luck Module Levels!',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow2',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Resource and Utility Module Levels!',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow3',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Cube Module Levels!',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow4',
      5
    ),
    ambrosiaModuleStat(
      'More Blueberry Quark Module Levels!',
      'RedAmbrosia/RedAmbrosiaFreeLevelsRow5',
      5
    ),
    ambrosiaModuleStat('Cubes "made" of Red Ambrosia', 'RedAmbrosia/RedAmbrosiaRedAmbrosiaCube'),
    ambrosiaModuleStat(
      'Hire Red Ambrosia Artisans',
      'RedAmbrosia/RedAmbrosiaRedAmbrosiaCubeImprover',
      20
    ),
    ambrosiaModuleStat('Obtainium ""made"" of Red Ambrosia', 'RedAmbrosia/RedAmbrosiaObtainium'),
    ambrosiaModuleStat('Offerings """made""" of Red Ambrosia', 'RedAmbrosia/RedAmbrosiaOffering'),
    ambrosiaModuleStat(
      'The Feast and the Famine',
      'RedAmbrosia/RedAmbrosiaFreeOfferingUpgrades',
      5
    ),
    ambrosiaModuleStat('Weird Science', 'RedAmbrosia/RedAmbrosiaFreeObtainiumUpgrades', 5),
    ambrosiaModuleStat("Livin' in a Box", 'RedAmbrosia/RedAmbrosiaFreeCubeUpgrades', 5),
    ambrosiaModuleStat('The Distance', 'RedAmbrosia/RedAmbrosiaFreeSpeedUpgrades', 5),
    ambrosiaModuleStat(
      'Red Infinity Shop Voucher',
      'RedAmbrosia/RedAmbrosiaInfiniteShopLevels',
      40
    ),
    ambrosiaModuleStat(
      'Red Digital Octeract Accumulator Accumulator',
      'RedAmbrosia/RedAmbrosiaFreeAccumulator',
      10
    ),
    ambrosiaModuleStat('The Dice that Decide Your Fate', 'RedAmbrosia/RedAmbrosiaRedLuck', 100),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement',
      'RedAmbrosia/RedAmbrosiaConversionImprovement1',
      5
    ),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement II: The Red Electric Boogaloo',
      'RedAmbrosia/RedAmbrosiaConversionImprovement2',
      3
    ),
    ambrosiaModuleStat(
      'Ambrosia Luck Converter Improvement III and a half',
      'RedAmbrosia/RedAmbrosiaConversionImprovement3',
      2
    ),
    ambrosiaModuleStat('Ossified Blueberry Tactics', 'RedAmbrosia/RedAmbrosiaRegularLuck', 100),
    ambrosiaModuleStat(
      'Ossified Blueberry Tactics II',
      'RedAmbrosia/RedAmbrosiaRegularLuck2',
      250
    ),
    ambrosiaModuleStat(
      'The Sands of Time',
      'RedAmbrosia/RedAmbrosiaBlueberryGenerationSpeed',
      100
    ),
    ambrosiaModuleStat(
      'The Sands of Time II',
      'RedAmbrosia/RedAmbrosiaBlueberryGenerationSpeed2',
      250
    ),
    ambrosiaModuleStat('Berries that are... blue?', 'RedAmbrosia/RedAmbrosiaBlueberries', 5),
    ambrosiaModuleStat(
      'Millennium-Aged Red Ambrosia',
      'RedAmbrosia/RedAmbrosiaRedGenerationSpeed',
      100
    ),
    ambrosiaModuleStat('Era of Red Ambrosia', 'RedAmbrosia/RedAmbrosiaRedGenerationSpeed2', 250),
    ambrosiaModuleStat('Red-Blue Ultrafusion', 'RedAmbrosia/RedAmbrosiaAccelerator', 100)
  ]
}

export const enchantmentSection: SectionData = {
  title: 'Ambrosia Module Enchantments',
  statCards: false,
  items: [
    ambrosiaModuleStat('Ambrosia Tutorial Module', 'Default/BlueberryTutorial', 5),
    ambrosiaModuleStat('Ambrosia Quark Module I', 'Default/BlueberryQuarks', 10),
    ambrosiaModuleStat('Ambrosia Quark Module II', 'Default/BlueberryQuarks2'),
    ambrosiaModuleStat('Ambrosia Quark Module III', 'Default/BlueberryQuarks3'),
    ambrosiaModuleStat('Ambrosia Quark Capstone', 'Default/BlueberryQuarks4'),
    ambrosiaModuleStat('Mechanical - the 1981 Cut', 'Default/BlueberryFreeQuarkUpgrades'),
    ambrosiaModuleStat(
      'Shameless, Ambrosial Subscriber Advertisement',
      'Default/BlueberryPatreon'
    ),
    ambrosiaModuleStat('Ambrosia Cube Module I', 'Default/BlueberryCubes', 10),
    ambrosiaModuleStat('Ambrosia Cube Module II', 'Default/BlueberryCubes2'),
    ambrosiaModuleStat('Ambrosia Cube Module III', 'Default/BlueberryCubes3'),
    ambrosiaModuleStat('Ambrosia Cube^4', 'Default/BlueberryCubes4'),
    ambrosiaModuleStat('Silent Cube', 'Default/BlueberryFreeCubeUpgrades', 15),
    ambrosiaModuleStat('The Brick of Lead', 'Default/BlueberryBrickOfLead'),
    ambrosiaModuleStat('Ambrosia Luck Module I', 'Default/BlueberryLuck', 10),
    ambrosiaModuleStat('Ambrosia Luck Module II', 'Default/BlueberryLuck2'),
    ambrosiaModuleStat('Ambrosia Luck Module III', 'Default/BlueberryLuck3'),
    ambrosiaModuleStat('The Eight Leaf Clover', 'Default/BlueberryLuck4'),
    ambrosiaModuleStat(
      'The Green, Green Grass of Ambrosia',
      'Default/BlueberryFreeLuckUpgrades',
      10
    ),
    ambrosiaModuleStat('The Gambler', 'Default/BlueberryFreeRedLuckUpgrades', 25),
    ambrosiaModuleStat('Time in a Bottle', 'Default/BlueberryFreeGenerationLevels', 2),
    ambrosiaModuleStat('TWO MIND', 'Default/BlueberryMind'),
    ambrosiaModuleStat('Ambrosia Cube-Quark Hybrid Module I', 'Default/BlueberryCubeQuark'),
    ambrosiaModuleStat('Ambrosia Luck-Quark Hybrid Module I', 'Default/BlueberryLuckQuark'),
    ambrosiaModuleStat('Ambrosia Quark-Cube Hybrid Module I', 'Default/BlueberryQuarkCube'),
    ambrosiaModuleStat('Ambrosia Luck-Cube Hybrid Module I', 'Default/BlueberryLuckCube'),
    ambrosiaModuleStat('Ambrosia Quark-Luck Hybrid Module I', 'Default/BlueberryQuarkLuck'),
    ambrosiaModuleStat('Ambrosia Cube-Luck Hybrid Module I', 'Default/BlueberryCubeLuck'),
    ambrosiaModuleStat('RNG-based Obtainium Booster', 'Default/BlueberryObtainium'),
    ambrosiaModuleStat('Basic Obtainium Booster', 'Default/BlueberryBaseObtainium1', 20),
    ambrosiaModuleStat('Based Obtainium Booster', 'Default/BlueberryBaseObtainium2'),
    ambrosiaModuleStat('Blinded by Science', 'Default/BlueberryFreeObtainiumUpgrades', 25),
    ambrosiaModuleStat('RNG-based Offerings Booster', 'Default/BlueberryOffering'),
    ambrosiaModuleStat('Basic Offerings Booster', 'Default/BlueberryBaseOffering1', 40),
    ambrosiaModuleStat('Based Offerings Booster', 'Default/BlueberryBaseOffering2'),
    ambrosiaModuleStat('Youthful Cannibals', 'Default/BlueberryFreeOfferingUpgrades', 25),
    ambrosiaModuleStat(
      'Hyperfluxed Wow! Cube Industrial Production',
      'Default/BlueberryHyperflux'
    ),
    ambrosiaModuleStat('Singularity Stabilizer Module', 'Default/BlueberrySingReduction'),
    ambrosiaModuleStat(
      'Exo-Chromatic Kinetic Post-Modulated Singularity Stabilizer Module',
      'Default/BlueberrySingReduction2'
    ),
    ambrosiaModuleStat(
      'Talisman Ambrosia Embedding Module',
      'Default/BlueberryTalismanBonusRuneLevel',
      20
    ),
    ambrosiaModuleStat('Rune Coefficient Module', 'Default/BlueberryRuneOOMBonus', 20),
    ambrosiaModuleStat('Indigo Infinity Shop Voucher', 'Default/BlueberryInfiniteShopUpgrades'),
    ambrosiaModuleStat(
      'Violet Infinity Shop Voucher',
      'Default/BlueberryInfiniteShopUpgrades2',
      8
    ),
    ambrosiaModuleStat(
      'Periwinkle Infinity Shop Voucher',
      'Default/BlueberryInfiniteShopUpgrades3',
      8
    )
  ]
}
