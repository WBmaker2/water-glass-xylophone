export type GlassNote = {
  id: string
  solfege: string
  western: string
  frequency: number
  targetWaterLevel: number
}

export type TuningDifference = {
  cents: number
  label: '조금 높습니다' | '조금 낮습니다' | '잘 맞았습니다'
}

export const LOWEST_FREQUENCY = 261.63
export const HIGHEST_FREQUENCY = 523.25

const ratio = LOWEST_FREQUENCY / HIGHEST_FREQUENCY

const noteSeeds = [
  ['c4', '도', 'C4', 261.63],
  ['d4', '레', 'D4', 293.66],
  ['e4', '미', 'E4', 329.63],
  ['f4', '파', 'F4', 349.23],
  ['g4', '솔', 'G4', 392.0],
  ['a4', '라', 'A4', 440.0],
  ['b4', '시', 'B4', 493.88],
  ['c5', '높은 도', 'C5', 523.25],
] as const

export const GLASS_NOTES: GlassNote[] = noteSeeds.map(
  ([id, solfege, western, frequency]) => ({
    id,
    solfege,
    western,
    frequency,
    targetWaterLevel: Number(
      (
        Math.log(frequency / HIGHEST_FREQUENCY) / Math.log(ratio)
      ).toFixed(12),
    ),
  }),
)

export function clampWaterLevel(level: number): number {
  if (!Number.isFinite(level)) {
    return 0
  }
  if (level < 0) return 0
  if (level > 1) return 1
  return level
}

export function frequencyForWaterLevel(level: number): number {
  const clampedLevel = clampWaterLevel(level)
  return HIGHEST_FREQUENCY * ratio ** clampedLevel
}

export function waterLevelForFrequency(frequency: number): number {
  if (!Number.isFinite(frequency)) return 0
  const clampedFrequency = Math.min(
    Math.max(frequency, LOWEST_FREQUENCY),
    HIGHEST_FREQUENCY,
  )
  const level = Math.log(clampedFrequency / HIGHEST_FREQUENCY) / Math.log(ratio)
  return clampWaterLevel(level)
}

export function getNearestGlassNote(frequency: number): GlassNote {
  return GLASS_NOTES.reduce((nearest, current) => {
    const nearestDiff = Math.abs(nearest.frequency - frequency)
    const currentDiff = Math.abs(current.frequency - frequency)
    return currentDiff < nearestDiff ? current : nearest
  }, GLASS_NOTES[0])
}

export function getTuningDifference(
  frequency: number,
  targetFrequency: number,
): TuningDifference {
  if (!Number.isFinite(frequency) || !Number.isFinite(targetFrequency)) {
    return { cents: 0, label: '잘 맞았습니다' }
  }
  if (targetFrequency <= 0 || frequency <= 0) {
    return { cents: 0, label: '잘 맞았습니다' }
  }

  const cents = 1200 * Math.log2(frequency / targetFrequency)
  const absCents = Math.abs(cents)

  if (absCents <= 12) {
    return { cents, label: '잘 맞았습니다' }
  }

  if (cents > 0) {
    return { cents, label: '조금 높습니다' }
  }

  return { cents, label: '조금 낮습니다' }
}

export function formatFrequency(frequency: number): string {
  if (!Number.isFinite(frequency)) return '0Hz'
  return `${Math.round(frequency)}Hz`
}
