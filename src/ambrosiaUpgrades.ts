type ambrosiaUpgrade = {
  maxLevel: number,
  maxEnchant: number,
  cost: (level: number) => number,
  purpleCost: (level: number) => number,
  inversePurpleCost: (cost: number) => number,
  blueberryCost?: number,
  category?: 'tutorial' | 'luck' | 'resource' | 'cube' | 'quark',
  prerequisites?: Record<string, number>
}

const linearEnchant = (maxEnchant: number, price: number) => ({
  maxEnchant,
  purpleCost: (level: number) => price * level,
  inversePurpleCost: (cost: number) => cost / price
})

const quadraticEnchant = (maxEnchant: number, price: number) => ({
  maxEnchant,
  purpleCost: (level: number) => price * level * (level + 1),
  inversePurpleCost: (cost: number) => Math.sqrt(0.25 + cost / price) - 0.5
})

const squareEnchant = (maxEnchant: number, price: number) => ({
  maxEnchant,
  purpleCost: (level: number) => price * level ** 2,
  inversePurpleCost: (cost: number) => Math.sqrt(cost / price)
})

const geometricEnchant = (maxEnchant: number, price: number, base: number) => ({
  maxEnchant,
  purpleCost: (level: number) => price * (base ** level - 1) / (base - 1),
  inversePurpleCost: (cost: number) => Math.log1p(cost * (base - 1) / price) / Math.log(base)
})

const ambrosiaRuneOOMBonusCosts = [0]
for (let level = 0; level < 100; level++) {
  ambrosiaRuneOOMBonusCosts.push(
    ambrosiaRuneOOMBonusCosts[level] + Math.ceil(2500 * ((level + 1) ** 1.5 - level ** 1.5))
  )
}

export default {
  ambrosiaTutorial: {
    maxLevel: 10,
    ...quadraticEnchant(5, 0.5),
    cost: level => level ** 2,
    blueberryCost: 0,
    category: 'tutorial'
  },
  ambrosiaQuarks1: {
    maxLevel: 100,
    ...quadraticEnchant(10, 2.5),
    cost: level => level ** 3,
    blueberryCost: 0,
    category: 'quark',
    prerequisites: { ambrosiaTutorial: 10 }
  },
  ambrosiaCubes1: {
    maxLevel: 100,
    ...quadraticEnchant(10, 2.5),
    cost: level => level ** 3,
    blueberryCost: 0,
    category: 'cube',
    prerequisites: { ambrosiaTutorial: 10 }
  },
  ambrosiaLuck1: {
    maxLevel: 100,
    ...quadraticEnchant(10, 2.5),
    cost: level => level ** 3,
    blueberryCost: 0,
    category: 'luck',
    prerequisites: { ambrosiaTutorial: 10 }
  },
  ambrosiaQuarkCube1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 250 * level ** 3,
    blueberryCost: 1,
    category: 'cube',
    prerequisites: { ambrosiaCubes1: 30, ambrosiaQuarks1: 20 }
  },
  ambrosiaLuckCube1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 250 * level ** 3,
    blueberryCost: 1,
    category: 'cube',
    prerequisites: { ambrosiaCubes1: 30, ambrosiaLuck1: 20 }
  },
  ambrosiaCubeQuark1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 500 * level ** 3,
    blueberryCost: 1,
    category: 'quark',
    prerequisites: { ambrosiaQuarks1: 30, ambrosiaCubes1: 20 }
  },
  ambrosiaLuckQuark1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 500 * level ** 3,
    blueberryCost: 1,
    category: 'quark',
    prerequisites: { ambrosiaQuarks1: 30, ambrosiaLuck1: 20 }
  },
  ambrosiaCubeLuck1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 100 * level ** 3,
    blueberryCost: 1,
    category: 'luck',
    prerequisites: { ambrosiaLuck1: 30, ambrosiaCubes1: 20 }
  },
  ambrosiaQuarkLuck1: {
    maxLevel: 25,
    ...linearEnchant(1, 400),
    cost: level => 100 * level ** 3,
    blueberryCost: 1,
    category: 'luck',
    prerequisites: { ambrosiaLuck1: 30, ambrosiaQuarks1: 20 }
  },
  ambrosiaQuarks2: {
    maxLevel: 100,
    ...linearEnchant(1, 400),
    cost: level => 500 * level ** 2,
    blueberryCost: 1,
    category: 'quark',
    prerequisites: { ambrosiaQuarks1: 40 }
  },
  ambrosiaCubes2: {
    maxLevel: 100,
    ...linearEnchant(1, 200),
    cost: level => 500 * level ** 2,
    blueberryCost: 1,
    category: 'cube',
    prerequisites: { ambrosiaCubes1: 40 }
  },
  ambrosiaLuck2: {
    maxLevel: 100,
    ...linearEnchant(1, 500),
    cost: level => 250 * level ** 2,
    blueberryCost: 1,
    category: 'luck',
    prerequisites: { ambrosiaLuck1: 40 }
  },
  ambrosiaQuarks3: {
    maxLevel: 10,
    ...linearEnchant(1, 1200),
    cost: level => (725_000 + 25_000 * level) * level,
    blueberryCost: 3,
    category: 'quark',
    prerequisites: { ambrosiaQuarks1: 100, ambrosiaQuarks2: 50 }
  },
  ambrosiaQuarks4: {
    maxLevel: 100,
    ...linearEnchant(1, 3000),
    cost: level => 300_000 * level,
    blueberryCost: 5,
    category: 'quark',
    prerequisites: { ambrosiaQuarks3: 10 }
  },
  ambrosiaCubes3: {
    maxLevel: 100,
    ...linearEnchant(1, 600),
    cost: level => (72_500 + 2500 * level) * level,
    blueberryCost: 3,
    category: 'cube',
    prerequisites: { ambrosiaCubes1: 100, ambrosiaCubes2: 50 }
  },
  ambrosiaCubes4: {
    maxLevel: 50,
    ...linearEnchant(1, 1500),
    cost: level => (290_000 + 10_000 * level) * level,
    blueberryCost: 5,
    category: 'cube',
    prerequisites: { ambrosiaCubes3: 100 }
  },
  ambrosiaFreeCubeUpgrades: {
    maxLevel: 30,
    ...linearEnchant(15, 200),
    cost: level => 10_000 * level ** 2,
    blueberryCost: 2,
    category: 'cube',
    prerequisites: { ambrosiaCubes2: 100 }
  },
  ambrosiaLuck3: {
    maxLevel: 100,
    ...linearEnchant(1, 1500),
    cost: level => 50_000 * level,
    blueberryCost: 3,
    category: 'luck',
    prerequisites: { ambrosiaLuck1: 90, ambrosiaLuck2: 50 }
  },
  ambrosiaLuck4: {
    maxLevel: 50,
    ...linearEnchant(1, 3750),
    cost: level => (240_000 + 10_000 * level) * level,
    blueberryCost: 5,
    category: 'luck',
    prerequisites: { ambrosiaLuck3: 100 }
  },
  ambrosiaPatreon: {
    maxLevel: 1,
    ...linearEnchant(1, 200),
    cost: level => level ** 2,
    blueberryCost: 0
  },
  ambrosiaObtainium1: {
    maxLevel: 2,
    ...linearEnchant(1, 200),
    cost: level => [0, 50_000, 1_300_000][level],
    blueberryCost: 1
  },
  ambrosiaOffering1: {
    maxLevel: 2,
    ...linearEnchant(1, 200),
    cost: level => [0, 50_000, 1_300_000][level],
    blueberryCost: 1
  },
  ambrosiaHyperflux: {
    maxLevel: 7,
    ...linearEnchant(1, 777),
    cost: level => [0, 33_333, 99_999, 199_998, 333_330, 499_995, 999_990, 2_499_975][level],
    blueberryCost: 3
  },
  ambrosiaBaseOffering1: {
    maxLevel: 40,
    ...squareEnchant(40, 1),
    cost: level => 5 * level ** 3,
    blueberryCost: 0,
    category: 'resource'
  },
  ambrosiaBaseObtainium1: {
    maxLevel: 20,
    ...squareEnchant(20, 3),
    cost: level => 40 * level ** 3,
    blueberryCost: 0,
    category: 'resource'
  },
  ambrosiaBaseOffering2: {
    maxLevel: 60,
    ...linearEnchant(1, 500),
    cost: level => 20 * level ** 3,
    blueberryCost: 1,
    category: 'resource',
    prerequisites: { ambrosiaBaseOffering1: 30 }
  },
  ambrosiaBaseObtainium2: {
    maxLevel: 30,
    ...linearEnchant(1, 500),
    cost: level => 160 * level ** 3,
    blueberryCost: 1,
    category: 'resource',
    prerequisites: { ambrosiaBaseObtainium1: 15 }
  },
  ambrosiaFreeObtainiumUpgrades: {
    maxLevel: 50,
    ...linearEnchant(25, 100),
    cost: level => 4000 * level ** 2,
    blueberryCost: 2,
    category: 'resource',
    prerequisites: { ambrosiaBaseObtainium1: 20, ambrosiaBaseObtainium2: 30 }
  },
  ambrosiaFreeOfferingUpgrades: {
    maxLevel: 50,
    ...linearEnchant(25, 100),
    cost: level => 4000 * level ** 2,
    blueberryCost: 2,
    category: 'resource',
    prerequisites: { ambrosiaBaseOffering1: 30, ambrosiaBaseOffering2: 60 }
  },
  ambrosiaSingReduction1: {
    maxLevel: 2,
    ...linearEnchant(1, 150),
    cost: level => [0, 100_000, 10_000_000][level],
    blueberryCost: 2,
    prerequisites: { ambrosiaHyperflux: 4 }
  },
  ambrosiaInfiniteShopUpgrades1: {
    maxLevel: 20,
    ...linearEnchant(1, 800),
    cost: level => 25_000 * level,
    blueberryCost: 1,
    category: 'resource',
    prerequisites: { ambrosiaCubes1: 70, ambrosiaBaseOffering1: 20, ambrosiaBaseObtainium1: 10 }
  },
  ambrosiaInfiniteShopUpgrades2: {
    maxLevel: 20,
    ...quadraticEnchant(8, 40),
    cost: level => 75_000 * level,
    blueberryCost: 2,
    category: 'resource',
    prerequisites: { ambrosiaInfiniteShopUpgrades1: 20 }
  },
  ambrosiaInfiniteShopUpgrades3: {
    maxLevel: 20,
    ...quadraticEnchant(8, 125),
    cost: level => 500_000 * level,
    blueberryCost: 3,
    category: 'resource',
    prerequisites: { ambrosiaInfiniteShopUpgrades2: 20 }
  },
  ambrosiaSingReduction2: {
    maxLevel: 2,
    ...linearEnchant(1, 1500),
    cost: level => [0, 12_500_000, 50_000_000][level],
    blueberryCost: 4
  },
  ambrosiaTalismanBonusRuneLevel: {
    maxLevel: 100,
    ...quadraticEnchant(20, 3),
    cost: level => 100 * level ** 2,
    blueberryCost: 0,
    category: 'resource'
  },
  ambrosiaRuneOOMBonus: {
    maxLevel: 100,
    ...quadraticEnchant(20, 3),
    cost: level => ambrosiaRuneOOMBonusCosts[level],
    blueberryCost: 0,
    category: 'resource'
  },
  ambrosiaBrickOfLead: {
    maxLevel: 25,
    ...linearEnchant(1, 2000),
    cost: level => 10 * level ** 3,
    blueberryCost: 4
  },
  ambrosiaFreeLuckUpgrades: {
    maxLevel: 25,
    ...quadraticEnchant(10, 12),
    cost: level => 5000 * level ** 2,
    blueberryCost: 1,
    category: 'luck'
  },
  ambrosiaFreeGenerationUpgrades: {
    maxLevel: 5,
    ...geometricEnchant(2, 100, 10),
    cost: level => [0, 15_000, 75_000, 315_000, 1_275_000, 5_115_000][level],
    blueberryCost: 1,
    category: 'luck'
  },
  ambrosiaFreeRedLuckUpgrades: {
    maxLevel: 40,
    ...quadraticEnchant(25, 15),
    cost: level => 10_000 * level ** 2,
    blueberryCost: 2,
    category: 'luck',
    prerequisites: { ambrosiaFreeLuckUpgrades: 10 }
  },
  ambrosiaFreeQuarkUpgrades: {
    maxLevel: 10,
    ...linearEnchant(1, 2000),
    cost: level => 25_000 * level ** 3,
    blueberryCost: 2,
    category: 'quark'
  },
  twoMind: {
    maxLevel: 1,
    ...linearEnchant(1, 2222),
    cost: () => 0,
    blueberryCost: 8
  }
} satisfies Record<string, ambrosiaUpgrade>
