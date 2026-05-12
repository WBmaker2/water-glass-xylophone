export type GlassNote = {
  solfege: string
  western: string
  frequency: number
  targetWaterLevel: number
}

export type TuningDifference = {
  cents: number
  label: string
}

export const LOWEST_FREQUENCY = 261.63
export const HIGHEST_FREQUENCY = 523.25

const ratio = LOWEST_FREQUENCY / HIGHEST_FREQUENCY

export const GLASS_NOTES: GlassNote[] = [
  { solfege: '도', western: 'C4', frequency: 261.63 },
  { solfege: '레', western: 'D4', frequency: 293.66 },
  { solfege: '미', western: 'E4', frequency: 329.63 },
  { solfege: '파', western: 'F4', frequency: 349.23 },
  { solfege: '솔', western: 'G4', frequency: 392.0 },
  { solfege: '라', western: 'A4', frequency: 440.0 },
  { solfege: '시', western: 'B4', frequency: 493.88 },
  { solfege: '높은 도', western: 'C5', frequency: 523.25 },
].map((note) => ({
  ...note,
  targetWaterLevel: Number(
    (
      (Math.log(note.frequency / HIGHEST_FREQUENCY) /
        Math.log(ratio))
    ).toFixed(12),
  ),
}))

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
