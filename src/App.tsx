import { useMemo, useState } from 'react'
import { GlassCup } from './components/GlassCup'
import { TuningMission } from './components/TuningMission'
import { MelodyPractice } from './components/MelodyPractice'
import { useWaterGlassAudio } from './hooks/useWaterGlassAudio'
import {
  GLASS_NOTES,
  frequencyForWaterLevel,
  formatFrequency,
  getTuningDifference,
} from './lib/waterTone'
import './App.css'

export default function App() {
  const targetLevels = useMemo(
    () => GLASS_NOTES.map((note) => note.targetWaterLevel),
    [],
  )
  const [waterLevels, setWaterLevels] = useState<number[]>(targetLevels)
  const [status, setStatus] = useState('실험 준비가 되었습니다.')
  const { playTone } = useWaterGlassAudio()

  const matchedNotes = useMemo(
    () =>
      waterLevels.map((level, index) => {
        const note = GLASS_NOTES[index]
        const frequency = frequencyForWaterLevel(level)
        const { cents } = getTuningDifference(frequency, note.frequency)
        return {
          note,
          frequency,
          isMatched: Math.abs(cents) <= 12,
        }
      }),
    [waterLevels],
  )

  const updateWaterLevel = (index: number, nextLevel: number) => {
    setWaterLevels((prev) =>
      prev.map((level, i) => (i === index ? nextLevel : level)),
    )
  }

  const strikeCup = (index: number) => {
    const note = GLASS_NOTES[index]
    const currentFrequency = frequencyForWaterLevel(waterLevels[index])
    void playTone({ frequency: currentFrequency })
    setStatus(
      `${note.solfege} 컵을 쳤습니다. ${formatFrequency(currentFrequency)} / 물이 많을수록 낮은 소리, 물이 적을수록 높은 소리`,
    )
  }

  const resetToTarget = () => {
    setWaterLevels(targetLevels)
    setStatus('도레미파솔라시도 목표 물 높이로 다시 맞췄습니다.')
  }

  return (
    <main className="app-shell">
      <section className="lab-stage" aria-labelledby="app-title">
        <div className="header">
          <p className="eyebrow">3~4학년 과학 / 음악</p>
          <h1 id="app-title">찰랑찰랑 디지털 물컵 실로폰</h1>
          <p className="intro">
            물의 양을 바꾸며 소리의 높낮이를 비교하고, 직접 컵을 조율해 음계를
            연주해 보세요.
          </p>
        </div>
        <div className="controls">
          <button
            type="button"
            className="reset-button"
            onClick={resetToTarget}
          >
            음계로 맞추기
          </button>
        </div>
        <p role="status" aria-live="polite" className="status-line">
          {status}
        </p>
      </section>
      <section className="experiment-layout">
        <section className="cup-rack" aria-label="물컵 실로폰">
          {GLASS_NOTES.map((note, index) => {
            const noteStatus = matchedNotes[index]
            return (
              <GlassCup
                key={note.id}
                note={note}
                waterLevel={waterLevels[index]}
                isTargetMatched={noteStatus?.isMatched ?? false}
                onWaterLevelChange={(nextLevel) =>
                  updateWaterLevel(index, nextLevel)
                }
                onStrike={() => strikeCup(index)}
              />
            )
          })}
        </section>
        <aside className="side-panel" aria-label="수업 미션">
          <TuningMission waterLevels={waterLevels} />
          <MelodyPractice />
        </aside>
      </section>
    </main>
  )
}
