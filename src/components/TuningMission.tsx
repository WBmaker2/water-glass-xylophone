import {
  GLASS_NOTES,
  frequencyForWaterLevel,
  getTuningDifference,
} from '../lib/waterTone'

type TuningMissionProps = {
  waterLevels: number[]
}

export function TuningMission({ waterLevels }: TuningMissionProps) {
  const statusRows = GLASS_NOTES.map((note, index) => {
    const level = waterLevels[index] ?? note.targetWaterLevel
    const frequency = frequencyForWaterLevel(level)
    const tuning = getTuningDifference(frequency, note.frequency)
    return {
      note,
      tuning,
      isMatched: Math.abs(tuning.cents) <= 12,
    }
  })
  const matchedCount = statusRows.filter((row) => row.isMatched).length

  return (
    <section className="mission-panel" aria-labelledby="tuning-title">
      <h2 id="tuning-title">도레미 튜닝 미션</h2>
      <p className="mission-summary">
        목표 음에 가까운 컵: {matchedCount}/8
      </p>
      <ol className="tuning-list">
        {statusRows.map((row) => {
          return (
            <li
              key={row.note.id}
              className={`tuning-item${row.isMatched ? ' is-matched' : ''}`}
            >
              <span className="tuning-note">{row.note.solfege}</span>
              <span className="tuning-state">{row.tuning.label}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
