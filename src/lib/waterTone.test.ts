import {
  GLASS_NOTES,
  clampWaterLevel,
  frequencyForWaterLevel,
  getNearestGlassNote,
  getTuningDifference,
  waterLevelForFrequency,
} from './waterTone'

describe('waterTone model', () => {
  it('maps lower water level to higher frequency and higher water level to lower frequency', () => {
    expect(frequencyForWaterLevel(0)).toBeGreaterThan(frequencyForWaterLevel(1))
    expect(frequencyForWaterLevel(0.2)).toBeGreaterThan(frequencyForWaterLevel(0.8))
  })

  it('clamps water level to 0~1 and handles NaN', () => {
    expect(clampWaterLevel(-0.2)).toBe(0)
    expect(clampWaterLevel(0.42)).toBe(0.42)
    expect(clampWaterLevel(1.3)).toBe(1)
  })

  it('defines GLASS_NOTES in ascending pitch order with water level metadata', () => {
    expect(GLASS_NOTES).toHaveLength(8)
    expect(GLASS_NOTES[0]).toMatchObject({
      id: 'c4',
      solfege: '도',
      western: 'C4',
      frequency: 261.63,
    })
    expect(GLASS_NOTES[7]).toMatchObject({
      id: 'c5',
      solfege: '높은 도',
      western: 'C5',
      frequency: 523.25,
    })
    expect(GLASS_NOTES[0].targetWaterLevel).toBeGreaterThan(
      GLASS_NOTES[7].targetWaterLevel,
    )
  })

  it('round-trips frequency and water level around G4', () => {
    const level = waterLevelForFrequency(392)
    const roundTrip = frequencyForWaterLevel(level)
    expect(roundTrip).toBeCloseTo(392, 1)
  })

  it('finds nearest glass note and evaluates tuning difference', () => {
    const nearest = getNearestGlassNote(391.5)
    expect(nearest.solfege).toBe('솔')

    const tuning = getTuningDifference(391.5, nearest.frequency)
    expect(Math.abs(tuning.cents)).toBeLessThan(3)
    expect(tuning.label).toBe('잘 맞았습니다')
  })
})
