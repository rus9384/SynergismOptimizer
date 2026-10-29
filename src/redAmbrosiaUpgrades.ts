type RedAmbrosiaUpgrade = {
  maxLevel: number,
  cost: (level: number) => number,
  inverseCost: (cost: number) => number
}

const linear = (maxLevel: number, price: number): RedAmbrosiaUpgrade => ({
  maxLevel,
  cost: level => price * level,
  inverseCost: cost => cost / price
})

const quadratic = (maxLevel: number, price: number): RedAmbrosiaUpgrade => ({
  maxLevel,
  cost: level => price * level * (level + 1),
  inverseCost: cost => Math.sqrt(0.25 + cost / price) - 0.5
})

const geometric = (maxLevel: number, price: number, base: number): RedAmbrosiaUpgrade => ({
  maxLevel,
  cost: level => price * (base ** level - 1) / (base - 1),
  inverseCost: cost => Math.log(cost * (base - 1) / price + 1) / Math.log(base)
})

const table = (costs: number[]): RedAmbrosiaUpgrade => ({
  maxLevel: costs.length - 1,
  cost: level => costs[level],
  inverseCost: cost => costs.indexOf(cost)
})

export default {
  tutorial: linear(100, 1),
  viscount: linear(1, 99_999),
  salvageYinYang: quadratic(100, 100),
  freeTutorialLevels: quadratic(5, 0.5),
  freeLevelsRow2: geometric(5, 10, 2),
  freeLevelsRow3: geometric(5, 250, 2),
  freeLevelsRow4: geometric(5, 5000, 2),
  freeLevelsRow5: geometric(5, 50_000, 2),
  redAmbrosiaCube: linear(1, 500),
  redAmbrosiaCubeImprover: quadratic(20, 50),
  redAmbrosiaObtainium: linear(1, 1250),
  redAmbrosiaOffering: linear(1, 4000),
  freeOfferingUpgrades: geometric(5, 1000, 3),
  freeObtainiumUpgrades: geometric(5, 1500, 3),
  freeCubeUpgrades: geometric(5, 10_000, 3),
  freeSpeedUpgrades: geometric(5, 15_000, 3),
  infiniteShopUpgrades: {
    maxLevel: 40,
    cost: level => 50 * level * (level + 3),
    inverseCost: cost => Math.sqrt(2.25 + cost / 50) - 1.5
  },
  redAmbrosiaFreeAccumulator: table(
    [0, 100, 500, 1500, 4500, 14_500, 39_500, 110_000, 250_000, 650_000, 1_650_000]
  ),
  redLuck: quadratic(100, 2),
  conversionImprovement1: geometric(5, 5, 2),
  conversionImprovement2: geometric(3, 200, 4),
  conversionImprovement3: geometric(2, 10_000, 10),
  regularLuck: quadratic(100, 0.5),
  regularLuck2: linear(250, 8000),
  blueberryGenerationSpeed: quadratic(100, 0.5),
  blueberryGenerationSpeed2: linear(250, 8000),
  blueberries: table([0, 100_000, 1_500_000, 4_500_000, 7_750_000, 11_250_000]),
  redGenerationSpeed: quadratic(100, 6),
  redGenerationSpeed2: quadratic(250, 120),
  redAmbrosiaAccelerator: linear(100, 1000)
} satisfies Record<string, RedAmbrosiaUpgrade>
