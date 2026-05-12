import { useCallback, useRef } from 'react'

export type PlayToneOptions = {
  frequency: number
  duration?: number
}

type BrowserWindowWithAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

export function useWaterGlassAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const ensureAudioContext = useCallback((): AudioContext | null => {
    const AudioContextConstructor =
      typeof AudioContext !== 'undefined'
        ? AudioContext
        : (window as BrowserWindowWithAudio).webkitAudioContext

    if (!AudioContextConstructor) {
      return null
    }

    if (audioContextRef.current == null) {
      audioContextRef.current = new AudioContextConstructor()
    }

    return audioContextRef.current
  }, [])

  const playTone = useCallback(
    async ({ frequency, duration = 0.72 }: PlayToneOptions): Promise<void> => {
      const context = ensureAudioContext()

      if (context == null) {
        return
      }

      try {
        if (context.state === 'suspended') {
          await context.resume()
        }
      } catch {
        return
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
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }

      oscillator.start(now)
      oscillator.stop(now + duration + 0.04)
    },
    [ensureAudioContext],
  )

  return { playTone }
}
