import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

class MockAudioParam {
  value: number

  constructor(initialValue = 0) {
    this.value = initialValue
  }

  setValueAtTime = vi.fn((value: number, _time: number) => {
    void _time
    this.value = value
    return this
  })

  exponentialRampToValueAtTime = vi.fn((value: number, _time: number) => {
    void _time
    this.value = value
    return this
  })
}

class MockOscillatorNode {
  frequency = new MockAudioParam()
  type: OscillatorType = 'sine'

  connect = vi.fn()
  disconnect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class MockGainNode {
  gain = new MockAudioParam(1)

  connect = vi.fn()
  disconnect = vi.fn()
}

class MockAudioContext {
  state: AudioContextState = 'suspended'
  currentTime = 0
  destination = {} as AudioDestinationNode

  resume = vi.fn(async () => {
    this.state = 'running'
    return this
  })

  createOscillator = vi.fn(() => new MockOscillatorNode())
  createGain = vi.fn(() => new MockGainNode())
}

;(globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext =
  MockAudioContext as never
;(window as unknown as { AudioContext: typeof MockAudioContext }).AudioContext =
  MockAudioContext as never
