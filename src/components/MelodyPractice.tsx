import { type ChangeEvent } from 'react'
import { type PracticeSong } from '../data/songs'

type MelodyPracticeProps = {
  songs: PracticeSong[]
  selectedSongId: string
  onSongSelect: (songId: string) => void
}

export function MelodyPractice({
  songs,
  selectedSongId,
  onSongSelect,
}: MelodyPracticeProps) {
  const selectedSong = songs.find((song) => song.id === selectedSongId) ?? songs[0]

  const handleSongChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSongSelect(event.target.value)
  }

  return (
    <section
      className="mission-panel melody-panel"
      aria-labelledby="melody-title"
    >
      <h2 id="melody-title">연주 미션</h2>
      <label htmlFor="melody-song-select" className="melody-song-label">
        연주 곡 선택
      </label>
      <select
        id="melody-song-select"
        className="melody-song-select"
        value={selectedSongId}
        onChange={handleSongChange}
      >
        {songs.map((song) => (
          <option key={song.id} value={song.id}>
            {song.title}
          </option>
        ))}
      </select>
      <p className="melody-title">{selectedSong.title}</p>
      <p className="melody-description">{selectedSong.description}</p>
      <p className="melody-notes" aria-label="연주 음계">
        {selectedSong.notes.join(' ')}
      </p>
    </section>
  )
}
