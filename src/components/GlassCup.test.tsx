import React from 'react'
import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import GlassCup from './GlassCup'
import type { GlassNote } from '../lib/waterTone'

function firePointerEvent(
  element: HTMLElement,
  type: 'pointerDown' | 'pointerMove' | 'pointerUp',
  clientY: number,
) {
  const event = createEvent[type](element, { bubbles: true })
  Object.defineProperty(event, 'clientY', { value: clientY })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  fireEvent(element, event)
}

describe('GlassCup', () => {
  const baseNote: GlassNote = {
    id: 'c4',
    solfege: '도',
    western: 'C4',
    frequency: 261.63,
    targetWaterLevel: 0.8,
  }

  it('renders accessible slider and strike button for 도', () => {
    const onWaterLevelChange = vi.fn()
    const onStrike = vi.fn()

    render(
      <GlassCup
        note={baseNote}
        waterLevel={0.8}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )

    const slider = screen.getByRole('slider', { name: '도 물 높이' })
    expect(slider).toHaveAttribute('aria-orientation', 'vertical')
    expect(slider).toHaveAttribute('aria-valuenow', '80')

    const strikeButton = screen.getByRole('button', { name: '도 컵 치기' })
    expect(strikeButton).toBeInTheDocument()
  })

  it('ArrowUp on 미 slider from 0.5 calls onWaterLevelChange(0.55)', () => {
    const miNote: GlassNote = {
      id: 'e4',
      solfege: '미',
      western: 'E4',
      frequency: 329.63,
      targetWaterLevel: 0.5,
    }
    const onWaterLevelChange = vi.fn()
    const onStrike = vi.fn()

    render(
      <GlassCup
        note={miNote}
        waterLevel={0.5}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )

    const slider = screen.getByRole('slider', { name: '미 물 높이' })
    fireEvent.keyDown(slider, { key: 'ArrowUp' })

    expect(onWaterLevelChange).toHaveBeenCalledTimes(1)
    expect(onWaterLevelChange).toHaveBeenCalledWith(0.55)
  })

  it('changes water level from pointer position while dragging', () => {
    const onWaterLevelChange = vi.fn()
    const onStrike = vi.fn()

    render(
      <GlassCup
        note={baseNote}
        waterLevel={0.2}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )

    const slider = screen.getByRole('slider', { name: '도 물 높이' })
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      bottom: 200,
      height: 100,
      left: 0,
      right: 80,
      top: 100,
      width: 80,
      x: 0,
      y: 100,
      toJSON: () => {},
    } as DOMRect)
    Object.assign(slider, {
      hasPointerCapture: vi.fn(() => true),
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    })

    firePointerEvent(slider, 'pointerDown', 150)
    firePointerEvent(slider, 'pointerMove', 120)
    firePointerEvent(slider, 'pointerUp', 120)

    expect(onWaterLevelChange).toHaveBeenNthCalledWith(1, 0.5)
    expect(onWaterLevelChange).toHaveBeenNthCalledWith(2, 0.8)
  })

  it('supports Home/End/PageUp/PageDown and updates ARIA values', () => {
    const ControlledCup = () => {
      const [level, setLevel] = React.useState(0.5)

      return (
        <GlassCup
          note={baseNote}
          waterLevel={level}
          isTargetMatched={false}
          onWaterLevelChange={(nextLevel) => setLevel(nextLevel)}
          onStrike={() => {}}
        />
      )
    }

    render(<ControlledCup />)

    const slider = screen.getByRole('slider', { name: '도 물 높이' })
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('물 0퍼센트'),
    )

    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('물 100퍼센트'),
    )

    fireEvent.keyDown(slider, { key: 'PageDown' })
    expect(slider).toHaveAttribute('aria-valuenow', '90')
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('물 90퍼센트'),
    )

    fireEvent.keyDown(slider, { key: 'PageUp' })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
    expect(slider).toHaveAttribute(
      'aria-valuetext',
      expect.stringContaining('물 100퍼센트'),
    )
  })

  it('clamps Home/End/PageUp/PageDown values within 0 to 1', () => {
    const onWaterLevelChange = vi.fn()
    const onStrike = vi.fn()

    const { unmount: unmountNearTop } = render(
      <GlassCup
        note={baseNote}
        waterLevel={0.97}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )

    const slider = screen.getByRole('slider', { name: '도 물 높이' })
    fireEvent.keyDown(slider, { key: 'PageUp' })
    expect(onWaterLevelChange).toHaveBeenCalledWith(1)
    unmountNearTop()

    const { unmount: unmountNearBottom } = render(
      <GlassCup
        note={baseNote}
        waterLevel={0.03}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )
    const sliderNearBottom = screen.getByRole('slider', { name: '도 물 높이' })
    fireEvent.keyDown(sliderNearBottom, { key: 'PageDown' })
    expect(onWaterLevelChange).toHaveBeenLastCalledWith(0)
    unmountNearBottom()
  })

  it('clicking 솔 strike button calls onStrike once', () => {
    const solNote: GlassNote = {
      id: 'g4',
      solfege: '솔',
      western: 'G4',
      frequency: 392,
      targetWaterLevel: 0.4,
    }
    const onWaterLevelChange = vi.fn()
    const onStrike = vi.fn()

    render(
      <GlassCup
        note={solNote}
        waterLevel={0.4}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={onStrike}
      />,
    )

    const strikeButton = screen.getByRole('button', { name: '솔 컵 치기' })
    fireEvent.click(strikeButton)

    expect(onWaterLevelChange).not.toHaveBeenCalled()
    expect(onStrike).toHaveBeenCalledTimes(1)
  })
})
