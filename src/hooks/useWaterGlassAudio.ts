import { useCallback, useRef } from 'react'

export type PlayToneOptions = {
  frequency: number
  duration?: number
}

export function useWaterGlassAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof AudioContext === 'undefined') {
      return null
    }

    if (audioContextRef.current == null) {
      audioContextRef.current = new AudioContext()
    }

    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    async ({ frequency, duration = 0.72 }: PlayToneOptions): Promise<void> => {
      const context = ensureAudioContext()

      if (context == null) {
        return
      }

      if (context.state === 'suspended') {
        await context.resume()
      }

      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, now)

      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.42, now + 0.025)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start(now)
      oscillator.stop(now + duration + 0.04)
    },
    [ensureAudioContext],
  )

  return { playTone }
}
