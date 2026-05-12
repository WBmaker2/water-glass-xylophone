import { PRACTICE_SONGS } from '../data/songs'

export function MelodyPractice() {
  const song = PRACTICE_SONGS[0]

  return (
    <section
      className="mission-panel melody-panel"
      aria-labelledby="melody-title"
    >
      <h2 id="melody-title">연주 미션</h2>
      <p className="melody-title">{song.title}</p>
      <p className="melody-description">{song.description}</p>
      <p className="melody-notes" aria-label="연주 음계">
        {song.notes.join(' ')}
      </p>
    </section>
  )
}
