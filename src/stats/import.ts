import Decimal from 'break_infinity.js'
import { z } from 'zod'
import ambrosiaUpgrades from '../ambrosiaUpgrades'
import { DOMCacheGetOrSet } from '../DOMCache'
import redAmbrosiaUpgrades from '../redAmbrosiaUpgrades'
import { toKebabCase } from '../utilities'
import { allStats, baseStats, updateCubes, writeStats } from './data'

const numericInput = z.union([z.number(), z.string().trim().min(1)])
const numberSchema = numericInput.transform(Number).pipe(z.number().nonnegative())
const booleanSchema = z.boolean()
const decimalSchema = numericInput.transform((value, ctx) => {
  try {
    const decimal = new Decimal(value)
    if (Number.isFinite(decimal.m) && Number.isFinite(decimal.e))
      return decimal
  } catch {
    // Invalid decimal strings are reported as validation errors below.
  }

  ctx.addIssue({ code: 'custom', message: 'Expected a finite decimal.' })
  return z.NEVER
})

const levelsSchema = z.record(z.string(), numberSchema)
const redAmbrosiaStatNames: Record<string, string> = {
  blueberries: 'redAmbrosiaBlueberries',
  redLuck: 'redAmbrosiaRedLuck'
}
const hepteractSchema = z.object({ BAL: numberSchema })
const transcriptionSchema = numberSchema.transform(
  value => Math.max(0, Math.round(value > 1e55
    ? (Math.log10(value) - 55) / 9.2 + 10
    : (Math.log10(value) - 25) / 3
  ))
)

const saveSchema = z.object({
  worlds: numberSchema,
  runes: z.object({
    superiorIntellect: decimalSchema,
    infiniteAscent: decimalSchema
  }),
  shopUpgrades: z.object({
    improveQuarkHept: numberSchema,
    improveQuarkHept2: numberSchema,
    improveQuarkHept3: numberSchema,
    improveQuarkHept4: numberSchema,
    improveQuarkHept5: numberSchema,
    shopAmbrosiaLuck1: numberSchema,
    shopAmbrosiaLuck2: numberSchema,
    shopAmbrosiaLuck3: numberSchema,
    shopAmbrosiaLuck4: numberSchema,
    shopRedLuck1: numberSchema,
    shopRedLuck2: numberSchema,
    shopRedLuck3: numberSchema,
    shopRedLuck4: numberSchema,
    shopAmbrosiaGeneration1: numberSchema,
    shopAmbrosiaGeneration2: numberSchema,
    shopAmbrosiaGeneration3: numberSchema,
    shopAmbrosiaGeneration4: numberSchema,
    shopSingularityPenaltyDebuff: numberSchema
  }),
  octUpgrades: z.object({
    octeractOneMindImprover: z.object({ octeractsInvested: transcriptionSchema })
  }),
  singularityCount: numberSchema,
  singularityChallenges: z.record(z.string(), z.object({ enabled: booleanSchema })),
  lifetimeAmbrosia: numberSchema,
  lifetimeRedAmbrosia: numberSchema,
  ambrosiaUpgrades: z.record(z.string(), z.object({
    purpleAmbrosiaInvested: numberSchema
  })),
  redAmbrosiaUpgrades: levelsSchema,
  wowCubes: numberSchema,
  wowTesseracts: numberSchema,
  wowHypercubes: numberSchema,
  wowPlatonicCubes: numberSchema,
  wowAbyssals: numberSchema,
  wowOcteracts: numberSchema,
  overfluxPowder: numberSchema,
  hepteracts: z.object({
    chronos: hepteractSchema,
    hyperrealism: hepteractSchema,
    quark: hepteractSchema,
    challenge: hepteractSchema,
    abyss: hepteractSchema,
    accelerator: hepteractSchema,
    acceleratorBoost: hepteractSchema,
    multiplier: hepteractSchema
  }),
  hs_data: z.object({
    totalBaseObtainiumNoAmb: numberSchema,
    totalBaseOfferingsNoAmb: numberSchema,
    activeBells: numberSchema,
    runeSiRCNoAmb: numberSchema,
    runeSiBonusLevelsTotalNoAmb: numberSchema,
    runeIaBonusLevelsTotalNoAmb: numberSchema,
    runeIaBonusLevelsTalismanNoAmb: numberSchema,
    postAoag: booleanSchema,
    totalTalismanPowerMultiplierNoAmb: numberSchema,
    finalAscensionSpeedMultiplierNoAmb: numberSchema,
    ascensionSpeedExponentNoAmb: numberSchema,
    finalAmbrosiaBarPointsSNoAmb: numberSchema,
    totalRedBarPointsSNoAmb: numberSchema,
    blueberries: numberSchema,
    totalAmbrosiaLuckNoAmb: numberSchema,
    totalRedLuckNoAmb: numberSchema,
    ambrosiaLuckPer1RedLuckNoAmb: numberSchema,
    redAmbrosiaUpgrades: levelsSchema,
    ambrosiaUpgradeBonusLevels: levelsSchema,
    me_data: z.object({
      globalBonus: numberSchema,
      bonus: z.object({ quark: numberSchema })
    })
  }).optional()
})

export const statsImportSchema = z.string().trim().min(1).transform((contents, ctx) => {
  try {
    return JSON.parse(atob(contents)) as unknown
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Expected a Base64-encoded JSON Synergism export.' })
    return z.NEVER
  }
}).pipe(saveSchema).transform((save): typeof allStats => {
  const hs = save.hs_data
  const shop = save.shopUpgrades
  const challenges = save.singularityChallenges
  const stats: typeof allStats = {
    ...baseStats,
    obtBase: hs?.totalBaseObtainiumNoAmb ?? 'FAIL',
    offBase: hs?.totalBaseOfferingsNoAmb ?? 'FAIL',
    quarks: save.worlds,
    subscribersBonus: hs?.me_data.globalBonus ?? 'FAIL',
    personalSubscriptionBonus: hs?.me_data.bonus.quark ?? 'FAIL',
    activeBells: hs?.activeBells ?? 'FAIL',
    runeSiExp: save.runes.superiorIntellect,
    runeSiCoef: hs?.runeSiRCNoAmb ?? 'FAIL',
    runeSiBonus: hs?.runeSiBonusLevelsTotalNoAmb ?? 'FAIL',
    runeIaExp: save.runes.infiniteAscent,
    runeIaBonus: hs?.runeIaBonusLevelsTotalNoAmb ?? 'FAIL',
    runeIaTalisman: hs?.runeIaBonusLevelsTalismanNoAmb ?? 'FAIL',
    runeAoag: hs?.postAoag ?? 'FAIL',
    talismanPower: hs?.totalTalismanPowerMultiplierNoAmb ?? 'FAIL',
    quarkHept1: shop.improveQuarkHept,
    quarkHept2: shop.improveQuarkHept2,
    quarkHept3: shop.improveQuarkHept3,
    quarkHept4: shop.improveQuarkHept4,
    quarkHeptInf: shop.improveQuarkHept5,
    shopLuck1: shop.shopAmbrosiaLuck1,
    shopLuck2: shop.shopAmbrosiaLuck2,
    shopLuck3: shop.shopAmbrosiaLuck3,
    shopLuck4: shop.shopAmbrosiaLuck4,
    shopRedLuck1: shop.shopRedLuck1,
    shopRedLuck2: shop.shopRedLuck2,
    shopRedLuck3: shop.shopRedLuck3,
    shopRedLuck4: shop.shopRedLuck4,
    shopAmbGen1: shop.shopAmbrosiaGeneration1,
    shopAmbGen2: shop.shopAmbrosiaGeneration2,
    shopAmbGen3: shop.shopAmbrosiaGeneration3,
    shopAmbGen4: shop.shopAmbrosiaGeneration4,
    shopSingularityReducer: shop.shopSingularityPenaltyDebuff,
    ascensionSpeed: hs?.finalAscensionSpeedMultiplierNoAmb ?? 'FAIL',
    ascensionSpread: hs?.ascensionSpeedExponentNoAmb ?? 'FAIL',
    transcription: save.octUpgrades.octeractOneMindImprover.octeractsInvested,
    cubes: save.wowCubes,
    tesseracts: save.wowTesseracts,
    hypercubes: save.wowHypercubes,
    platonicCubes: save.wowPlatonicCubes,
    hepteracts: save.wowAbyssals,
    octeracts: save.wowOcteracts,
    chronosHepteract: save.hepteracts.chronos.BAL,
    hypercubeHepteract: save.hepteracts.hyperrealism.BAL,
    quarkHepteract: save.hepteracts.quark.BAL,
    challengeHepteract: save.hepteracts.challenge.BAL,
    abyssHepteract: save.hepteracts.abyss.BAL,
    acceleratorHepteract: save.hepteracts.accelerator.BAL,
    acceleratorBoostHepteract: save.hepteracts.acceleratorBoost.BAL,
    multiplierHepteract: save.hepteracts.multiplier.BAL,
    overfluxPowder: save.overfluxPowder,
    currentSingularity: save.singularityCount,
    currentExalt: [
      'noSingularityUpgrades',
      'oneChallengeCap',
      'limitedAscensions',
      'noQuarkUpgrades',
      'noOcteracts',
      'noAmbrosiaUpgrades',
      'limitedTime',
      'sadisticPrequel',
      'taxmanLastStand',
      'barDependence'
    ].findIndex(challenge => challenges[challenge]?.enabled) + 1,
    lifetimeAmbrosia: save.lifetimeAmbrosia,
    lifetimeRedAmbrosia: save.lifetimeRedAmbrosia,
    ambrosiaBarPoints: hs?.finalAmbrosiaBarPointsSNoAmb ?? 'FAIL',
    redBarPoints: hs?.totalRedBarPointsSNoAmb ?? 'FAIL',
    blueberries: hs?.blueberries ?? 'FAIL',
    baseLuck: hs?.totalAmbrosiaLuckNoAmb ?? 'FAIL',
    redLuck: hs?.totalRedLuckNoAmb ?? 'FAIL',
    luckConversion: hs?.ambrosiaLuckPer1RedLuckNoAmb ?? 'FAIL'
  }

  for (const [name, upgrade] of Object.entries(ambrosiaUpgrades)) {
    const invested = save.ambrosiaUpgrades?.[name]?.purpleAmbrosiaInvested
    if (typeof invested !== 'number')
      stats[name] = 'FAIL'
    else if (typeof baseStats[name] === 'boolean')
      stats[name] = invested > 0
    else
      stats[name] = Math.clamp(upgrade.inversePurpleCost(invested), 0, upgrade.maxLevel)
  }

  for (const [name, upgrade] of Object.entries(redAmbrosiaUpgrades)) {
    const statName = redAmbrosiaStatNames[name] ?? name
    const invested = save.redAmbrosiaUpgrades?.[name]
    if (typeof invested !== 'number')
      stats[statName] = 'FAIL'
    else if (typeof baseStats[statName] === 'boolean')
      stats[statName] = invested > 0
    else
      stats[statName] = Math.clamp(upgrade.inverseCost(invested), 0, upgrade.maxLevel)
  }

  updateCubes(stats)
  return stats
})

const createStatsFileReaderSchema = (signal?: AbortSignal) => z.file().transform(async (file, ctx) => {
  const reader = new FileReader()
  const abort = () => reader.abort()
  signal?.addEventListener('abort', abort, { once: true })

  try {
    return await new Promise<string>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error('File read aborted.'))
        return
      }

      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string')
          resolve(reader.result)
        else
          reject(new Error('Unable to read the export file.'))
      }, { once: true })
      reader.addEventListener('error',
        () => reject(reader.error ?? new Error('Unable to read the export file.')), { once: true }
      )
      reader.addEventListener('abort',
        () => reject(new Error('File read aborted.')), { once: true }
      )
      reader.readAsText(file)
    })
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Unable to read the export file.' })
    return z.NEVER
  } finally {
    signal?.removeEventListener('abort', abort)
  }
})

export const statsFileSchema = createStatsFileReaderSchema().pipe(statsImportSchema)

let activeImport: AbortController | undefined

export const importStatsFile = async (file: File) => {
  activeImport?.abort()
  const controller = new AbortController()
  activeImport = controller
  const fileResult = await createStatsFileReaderSchema(controller.signal).safeParseAsync(file)
  if (controller.signal.aborted)
    return

  const result = fileResult.success ? statsImportSchema.safeParse(fileResult.data) : fileResult
  if (!result.success) {
    console.error('Unable to import save:', result.error)
    return
  }

  Object.assign(allStats, result.data)
  for (const [name, value] of Object.entries(allStats)) {
    const input = DOMCacheGetOrSet(toKebabCase(name))
    if (input instanceof HTMLButtonElement) {
      input.value = String(value)
      input.classList.toggle('error', value === 'FAIL')
      input.dispatchEvent(new Event('change'))
      continue
    } else if (!(input instanceof HTMLInputElement)) {
      continue
    }

    if (input.type === 'checkbox') {
      input.classList.toggle('error', value === 'FAIL')
      // Don't change the toggle state on failure
      if (value !== 'FAIL')
        input.checked = Boolean(value)
    } else {
      input.parentElement?.classList.toggle('error', value === 'FAIL')
      input.value = String(value ?? '')
    }

    if (value === undefined || value === 'FAIL')
      continue

    input.dispatchEvent(new Event('change')) // Formats numbers
  }
  updateCubes()
  writeStats()
}

export const importStats = async (event: Event) => {
  // oxlint-disable-next-line no-unsafe-type-assertion
  const picker = event.target as HTMLInputElement
  const file = picker.files?.[0]
  picker.value = ''
  if (file)
    await importStatsFile(file)
}
